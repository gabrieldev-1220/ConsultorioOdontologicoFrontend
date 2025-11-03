import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { PiezaDental, SectorKey } from '../../../models/pieza-dental.model';
import { Procedimiento } from '../../../models/procedimiento.model';
import { OdontogramaService } from '../../../core/services/odontograma.service';
import { ApiService } from '../../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ProcedimientosService } from '../../../core/services/procedimientos.service';
import { Paciente } from '../../../models/paciente.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';

interface ToothDisplay {
  pieza: PiezaDental;
  cx: number;
  cy: number;
  labelX: number;
  labelY: number;
  comboX: number;
  comboY: number;
  textAnchor: 'middle' | 'start' | 'end';
}

const FDI_ORDER = [
  18, 17, 16, 15, 14, 13, 12, 11,
  21, 22, 23, 24, 25, 26, 27, 28,
  48, 47, 46, 45, 44, 43, 42, 41,
  31, 32, 33, 34, 35, 36, 37, 38
];

@Component({
  selector: 'app-odontogram',
  standalone: false,
  templateUrl: './odontogram.component.html',
  styleUrls: ['./odontogram.component.scss']
})
export class OdontogramComponent implements OnInit, AfterViewInit {
  @Input() pacienteId!: number;
  @ViewChild('odontogramaSvg', { static: false }) odontogramaSvg!: ElementRef<SVGSVGElement>;
  @ViewChild('presupuestoPrint', { static: false }) presupuestoPrint!: ElementRef<HTMLDivElement>;
  @ViewChild('previewIframe', { static: false }) previewIframe!: ElementRef<HTMLIFrameElement>;

  piezas: PiezaDental[] = [];
  upperTeeth: ToothDisplay[] = [];
  lowerTeeth: ToothDisplay[] = [];
  loading = false;

  procedimientos: Procedimiento[] = [];
  procedimientosFiltrados: Procedimiento[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = 'todos';
  procedimientosSeleccionados: Procedimiento[] = [];
  observaciones: string = '';

  surfaceColors: string[] = ['#FFFFFF', '#FF0000', '#0000FF', '#00A300', '#FFFF00'];
  estadosDisponibles = ['Sano', 'Caries', 'Empaste', 'Perdida', 'Fractura'];

  protected toothRadius = 48;
  protected oclusalRadius = 16;
  protected toothSpacing = 140;
  protected startX = 150;
  protected upperY = 150;
  protected lowerY = 460;

  numeroMode: 'FDI' | 'UNIVERSAL' = 'FDI';

  paciente: Paciente | null = null;

  pdfBlobUrl: SafeResourceUrl | null = null;
  pdfType: 'odontograma' | 'presupuesto' | null = null;
  private currentBlobUrl: string | null = null;

  private hasResetOnLogin = false;

  constructor(
    private odontogramaService: OdontogramaService,
    private apiService: ApiService,
    private procedimientosService: ProcedimientosService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const savedMode = localStorage.getItem('odontogramNumeroMode');
    if (savedMode === 'FDI' || savedMode === 'UNIVERSAL') {
      this.numeroMode = savedMode;
    }

    if (!this.pacienteId) {
      console.warn('PacienteId no proporcionado a OdontogramComponent');
      return;
    }

    this.loadPaciente();
    this.loadProcedimientos();
    this.loadPiezas();
  }

  ngAfterViewInit(): void {
    // Forzamos el reinicio del gráfico SOLO después de que el SVG esté listo
    setTimeout(() => {
      this.reiniciarGraficoSiNuevoLogin();
    }, 500);
  }

  private reiniciarGraficoSiNuevoLogin() {
    if (this.hasResetOnLogin) return;

    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();

    if (lastLogin !== today) {
      localStorage.setItem('lastLogin', today);
      this.resetView();
      this.hasResetOnLogin = true;
      this.toastr.info('Gráfico del odontograma reiniciado para nueva sesión.');
    }
  }

  private loadPaciente() {
    this.apiService.get<Paciente>(`Pacientes/${this.pacienteId}`).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
      },
      error: () => this.toastr.error('Error al cargar datos del paciente')
    });
  }

  private loadProcedimientos() {
    this.procedimientosService.getAll().subscribe({
      next: (data) => {
        this.procedimientos = data;
        this.filtrarProcedimientos();
        this.loadCategorias();
      },
      error: () => this.toastr.error('Error al cargar procedimientos')
    });
  }

  private loadCategorias() {
    this.procedimientosService.getCategorias().subscribe({
      next: (cats) => this.categorias = ['todos', ...cats]
    });
  }

  filtrarProcedimientos() {
    if (this.categoriaSeleccionada === 'todos') {
      this.procedimientosFiltrados = this.procedimientos;
    } else {
      this.procedimientosFiltrados = this.procedimientos.filter(p => p.categoria === this.categoriaSeleccionada);
    }
  }

  agregarProcedimiento(proc: Procedimiento) {
    if (!this.procedimientosSeleccionados.find(p => p.idProcedimiento === proc.idProcedimiento)) {
      this.procedimientosSeleccionados.push(proc);
    }
  }

  quitarProcedimiento(proc: Procedimiento) {
    this.procedimientosSeleccionados = this.procedimientosSeleccionados.filter(p => p.idProcedimiento !== proc.idProcedimiento);
  }

  getTotalCosto(): number {
    return this.procedimientosSeleccionados.reduce((sum, p) => sum + p.costo, 0);
  }

  getTotalDuracion(): number {
    return this.procedimientosSeleccionados.reduce((sum, p) => sum + p.duracionMinutos, 0);
  }

  private loadPiezas() {
    this.loading = true;
    this.odontogramaService.getPorPaciente(this.pacienteId).subscribe({
      next: (data: PiezaDental[]) => {
        if (!data || data.length === 0) {
          this.crearInicialYAsignar();
        } else {
          this.piezas = data
            .map((p: PiezaDental) => this.ensureSectors(p))
            .sort((a: PiezaDental, b: PiezaDental) => a.numeroPieza - b.numeroPieza);
          this.computeDisplayPositions();
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando piezas del odontograma', err);
        if (err?.status === 404) {
          this.crearInicialYAsignar();
          return;
        }
        this.toastr.error('Error al cargar el odontograma.');
        this.loading = false;
      }
    });
  }

  private crearInicialYAsignar() {
    this.odontogramaService.crearInicial(this.pacienteId).subscribe({
      next: (creadas: PiezaDental[]) => {
        this.piezas = (creadas || [])
          .map((p: PiezaDental) => this.ensureSectors(p))
          .sort((a: PiezaDental, b: PiezaDental) => a.numeroPieza - b.numeroPieza);
        this.computeDisplayPositions();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error creando odontograma inicial', err);
        this.toastr.error('No se pudo crear el odontograma inicial.');
        this.loading = false;
      }
    });
  }

  private ensureSectors(p: PiezaDental): PiezaDental {
    let sectors: Record<SectorKey, string> = {
      oclusal: p.color || '#FFFFFF',
      mesial: '#FFFFFF',
      distal: '#FFFFFF',
      bucal: '#FFFFFF',
      lingual: '#FFFFFF'
    };

    if (p.observaciones && typeof p.observaciones === 'string') {
      try {
        const parsed = JSON.parse(p.observaciones);
        if (parsed && parsed.sectors) {
          sectors = { ...sectors, ...parsed.sectors };
        }
      } catch (e) {
        console.warn('Error parsing observaciones JSON', e);
      }
    }

    (p as any).sectors = sectors;
    return p;
  }

  private computeDisplayPositions() {
    this.upperTeeth = [];
    this.lowerTeeth = [];

    for (let i = 0; i < 16; i++) {
      const fdi = FDI_ORDER[i];
      const pieza = this.getOrCreatePieza(fdi);
      const x = this.startX + i * this.toothSpacing;

      this.upperTeeth.push({
        pieza,
        cx: x,
        cy: this.upperY,
        labelX: 0,
        labelY: this.toothRadius + 35,
        comboX: -50,
        comboY: this.toothRadius + 65,
        textAnchor: 'middle'
      });
    }

    for (let i = 16; i < 32; i++) {
      const fdi = FDI_ORDER[i];
      const pieza = this.getOrCreatePieza(fdi);
      const x = this.startX + (i - 16) * this.toothSpacing;

      this.lowerTeeth.push({
        pieza,
        cx: x,
        cy: this.lowerY,
        labelX: 0,
        labelY: this.toothRadius + 35,
        comboX: -50,
        comboY: this.toothRadius + 65,
        textAnchor: 'middle'
      });
    }
  }

  private getOrCreatePieza(fdi: number): PiezaDental {
    let pieza = this.piezas.find(p => p.numeroPieza === fdi);
    if (!pieza) {
      pieza = {
        idPieza: undefined,
        idPaciente: this.pacienteId,
        numeroPieza: fdi,
        color: '#FFFFFF',
        estado: 'Sano',
        observaciones: null,
        fechaActualizacion: undefined,
        sectors: { oclusal: '#FFFFFF', mesial: '#FFFFFF', distal: '#FFFFFF', bucal: '#FFFFFF', lingual: '#FFFFFF' }
      } as PiezaDental;
    }
    (pieza as any).sectors = (pieza as any).sectors ?? {
      oclusal: pieza.color || '#FFFFFF',
      mesial: '#FFFFFF',
      distal: '#FFFFFF',
      bucal: '#FFFFFF',
      lingual: '#FFFFFF'
    };
    return pieza;
  }

  toggleSectorColor(pieza: PiezaDental, sector: SectorKey) {
    const colors = this.surfaceColors;
    const sectors = (pieza as any).sectors as Record<SectorKey, string>;
    const current = colors.indexOf(sectors[sector] || colors[0]);
    const next = (current + 1) % colors.length;
    sectors[sector] = colors[next];

    if (sector === 'oclusal') {
      pieza.color = colors[next];
    }
  }

  getSectorColor(pieza: PiezaDental, sector: SectorKey): string {
    const sectors = (pieza as any).sectors as Record<SectorKey, string> | undefined;
    return (sectors && sectors[sector]) ? sectors[sector] : '#FFFFFF';
  }

  cambiarEstado(pieza: PiezaDental, event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (select) pieza.estado = select.value;
  }

  resetView() {
    this.piezas.forEach(p => {
      const sectors = (p as any).sectors;
      if (sectors) {
        Object.keys(sectors).forEach(k => sectors[k as SectorKey] = '#FFFFFF');
      }
      p.estado = 'Sano';
      p.observaciones = null;
      p.color = '#FFFFFF';
    });
    this.observaciones = '';
  }

  guardar() {
    this.loading = true;
    const payload = this.piezas.map(p => {
      const sectors = (p as any).sectors as Record<SectorKey, string>;
      const observacionesObj = { sectors };

      return {
        IdPieza: p.idPieza,
        IdPaciente: p.idPaciente,
        NumeroPieza: p.numeroPieza,
        Color: sectors.oclusal,
        Estado: p.estado,
        Observaciones: JSON.stringify(observacionesObj)
      };
    });

    this.odontogramaService.actualizarPorPaciente(this.pacienteId, payload as any).subscribe({
      next: () => {
        this.guardarPlanTratamiento();
        this.guardarEnHistorialOdontogramas();
      },
      error: (err) => {
        console.error('Error al guardar odontograma', err);
        this.toastr.error('No se pudo guardar el odontograma.');
        this.loading = false;
      }
    });
  }

  private guardarEnHistorialOdontogramas() {
    const odontologo = this.authService.getFullName() || 'Odontólogo';
    const procedimientos = this.procedimientosSeleccionados.map(p => p.nombre);
    const nuevo = {
      fecha: new Date().toISOString().split('T')[0],
      odontologo,
      procedimientos
    };

    let historial = JSON.parse(localStorage.getItem(`odontogramas_${this.pacienteId}`) || '[]');
    historial.unshift(nuevo);
    localStorage.setItem(`odontogramas_${this.pacienteId}`, JSON.stringify(historial));

    this.toastr.success('Odontograma guardado y registrado en historial.');
    this.procedimientosSeleccionados = [];
    this.observaciones = '';
    this.loading = false;
  }

  guardarPlanTratamiento() {
    const idProcedimientos = this.procedimientosSeleccionados.map(p => p.idProcedimiento);
    const payload = {
      idProcedimientos: idProcedimientos,
      observaciones: this.observaciones
    };
    this.apiService.post<void>(`PlanesTratamiento/${this.pacienteId}`, payload).subscribe({
      next: () => {
        this.toastr.success('Plan de tratamiento y observaciones guardados correctamente.');
      },
      error: (err) => {
        console.error('Error al guardar plan de tratamiento', err);
        this.toastr.error('No se pudo guardar el plan de tratamiento.');
      }
    });
  }

  get today(): Date {
    return new Date();
  }

  private limpiarPreview() {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    this.pdfBlobUrl = null;
    this.pdfType = null;

    if (this.previewIframe?.nativeElement) {
      this.previewIframe.nativeElement.src = 'about:blank';
    }
  }

  async generarPresupuestoPDF() {
    this.limpiarPreview();

    if (!this.paciente || this.procedimientosSeleccionados.length === 0) {
      this.toastr.warning('Seleccione procedimientos para generar el presupuesto.');
      return;
    }

    if (!this.presupuestoPrint?.nativeElement) {
      this.toastr.error('Error: no se pudo generar el PDF del presupuesto.');
      return;
    }

    const element = this.presupuestoPrint.nativeElement;
    const clone = element.cloneNode(true) as HTMLElement;

    clone.style.cssText = `
      display: block !important;
      position: absolute !important;
      left: -9999px !important;
      top: 0 !important;
      visibility: visible !important;
      opacity: 1 !important;
      width: 800px !important;
      font-family: Arial, sans-serif !important;
      background: white !important;
      padding: 20px !important;
      box-sizing: border-box !important;
    `;

    const img = clone.querySelector('img');
    if (img && img.getAttribute('src')) {
      img.setAttribute('crossorigin', 'anonymous');
    }

    document.body.appendChild(clone);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: 800,
        windowWidth: 800,
        windowHeight: 1200
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas vacío');
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      let imgWidth = pdfWidth * 0.9;
      let imgHeight = imgWidth / ratio;

      if (imgHeight > pdfHeight * 0.9) {
        imgHeight = pdfHeight * 0.9;
        imgWidth = imgHeight * ratio;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      this.currentBlobUrl = blobUrl;

      this.pdfBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfType = 'presupuesto';

      setTimeout(() => {
        if (this.previewIframe?.nativeElement) {
          this.previewIframe.nativeElement.src = blobUrl;
        }
      }, 100);
    } catch (err) {
      console.error('Error generando PDF de presupuesto:', err);
      this.toastr.error('Error al generar el PDF del presupuesto.');
    } finally {
      if (document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
    }
  }

  async exportarOdontogramaPDF() {
    this.limpiarPreview();

    if (!this.odontogramaSvg?.nativeElement) {
      this.toastr.error('Odontograma no renderizado aún. Espere un momento.');
      return;
    }

    const svgElement = this.odontogramaSvg.nativeElement;
    const width = 2400;
    const height = 600;

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    svgString = svgString.replace(
      /<svg/,
      `<svg width="${width}" height="${height}" style="background-color: #ffffff; font-family: Arial, sans-serif;"`
    );

    svgString = svgString.replace(
      /<foreignObject/g,
      '<foreignObject width="160" height="60"'
    );
    svgString = svgString.replace(
      /<select/g,
      '<select style="width:100%; height:100%; font-size: 14px; padding: 2px;"'
    );

    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: ${width}px;
      height: ${height}px;
      background: white;
      padding: 20px;
      box-sizing: border-box;
      visibility: visible !important;
      opacity: 1 !important;
    `;
    container.innerHTML = svgString;
    document.body.appendChild(container);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        foreignObjectRendering: true,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas vacío');
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const ratio = canvas.width / canvas.height;
      let imgWidth = pdfWidth * 0.9;
      let imgHeight = imgWidth / ratio;

      if (imgHeight > pdfHeight * 0.9) {
        imgHeight = pdfHeight * 0.9;
        imgWidth = imgHeight * ratio;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      this.currentBlobUrl = blobUrl;

      this.pdfBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      this.pdfType = 'odontograma';

      setTimeout(() => {
        if (this.previewIframe?.nativeElement) {
          this.previewIframe.nativeElement.src = blobUrl;
        }
      }, 100);
    } catch (err) {
      console.error('Error generando odontograma PDF:', err);
      this.toastr.error('Error al generar el PDF del odontograma.');
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  }

  descargarPDF() {
    if (!this.pdfBlobUrl || !this.pdfType || !this.paciente || !this.currentBlobUrl) return;

    const a = document.createElement('a');
    a.href = this.currentBlobUrl;
    a.download = this.pdfType === 'odontograma'
      ? `Odontograma_${this.paciente.nombre}_${this.paciente.apellido}.pdf`
      : `Presupuesto_${this.paciente.nombre}_${this.paciente.apellido}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    this.cerrarPreview();
  }

  cerrarPreview() {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
    this.pdfBlobUrl = null;
    this.pdfType = null;

    if (this.previewIframe?.nativeElement) {
      this.previewIframe.nativeElement.src = 'about:blank';
    }
  }

  sectorPath(pieza: PiezaDental, sector: SectorKey): string {
    const path = (start: number, end: number) => this.sectorPathData(start, end, this.toothRadius);
    switch (sector) {
      case 'bucal': return path(-135, -45);
      case 'distal': return path(-45, 45);
      case 'lingual': return path(45, 135);
      case 'mesial': return path(135, 225);
      default: return '';
    }
  }

  private polarToCartesian(angleDeg: number, radius: number) {
    const rad = (angleDeg) * Math.PI / 180;
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  }

  private sectorPathData(startAngle: number, endAngle: number, r: number): string {
    const p1 = this.polarToCartesian(startAngle, r);
    const p2 = this.polarToCartesian(endAngle, r);
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    return `M 0 0 L ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} Z`;
  }

  getOclusalRadius(): number { return this.oclusalRadius; }
  getLabelX(td: ToothDisplay): number { return td.labelX; }
  getLabelY(td: ToothDisplay): number { return td.labelY; }
  getComboX(td: ToothDisplay): number { return td.comboX; }
  getComboY(td: ToothDisplay): number { return td.comboY; }
  getTextAnchor(td: ToothDisplay): string { return td.textAnchor; }

  toggleNumeration() {
    this.numeroMode = this.numeroMode === 'FDI' ? 'UNIVERSAL' : 'FDI';
    localStorage.setItem('odontogramNumeroMode', this.numeroMode);
  }

  getToothLabel(td: ToothDisplay): string {
    if (this.numeroMode === 'UNIVERSAL') {
      const index = FDI_ORDER.indexOf(td.pieza.numeroPieza);
      return (index >= 0 ? (index + 1).toString() : '?');
    } else {
      return td.pieza.numeroPieza.toString().padStart(2, '0');
    }
  }
}