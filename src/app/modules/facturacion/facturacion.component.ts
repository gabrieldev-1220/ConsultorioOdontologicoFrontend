import { Component, Input, OnInit } from '@angular/core';

interface Pago {
  fecha: string;
  concepto: string;
  monto: number;
  estado: 'pagado' | 'pendiente';
}

@Component({
  selector: 'app-facturacion',
  standalone: false,
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.scss'
})
export class FacturacionComponent implements OnInit {
  @Input() pacienteId!: number;
  pagos: Pago[] = [];
  totalPagado = 0;

  ngOnInit() {
    this.pagos = [
      { fecha: '2025-10-15', concepto: 'Limpieza dental', monto: 4000, estado: 'pagado' },
      { fecha: '2025-09-10', concepto: 'Consulta inicial', monto: 2000, estado: 'pagado' },
      { fecha: '2025-11-01', concepto: 'Ortodoncia mensual', monto: 5000, estado: 'pendiente' }
    ];

    this.totalPagado = this.pagos
      .filter(p => p.estado === 'pagado')
      .reduce((sum, p) => sum + p.monto, 0);
  }

  imprimirFactura() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const logoUrl = '/assets/images/icono_pdf.jpg';
    const fechaActual = new Date().toLocaleDateString('es-AR');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Factura Paciente ${this.pacienteId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; background: #f9f9f9; }
          .factura { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #185a9d; padding-bottom: 15px; }
          .logo { height: 80px; }
          .info { text-align: right; font-size: 0.9rem; color: #555; }
          .paciente { margin: 20px 0; padding: 15px; background: #f0f7ff; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
          th { background: #185a9d; color: white; }
          .total { font-weight: bold; font-size: 1.1rem; background: #e3f2fd; }
          .footer { margin-top: 40px; text-align: center; color: #777; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <div class="factura">
          <div class="header">
            <img src="${logoUrl}" class="logo" alt="Logo Consultorio">
            <div class="info">
              <p><strong>Fecha:</strong> ${fechaActual}</p>
              <p><strong>Paciente ID:</strong> ${this.pacienteId}</p>
            </div>
          </div>

          <div class="paciente">
            <h3>Pagos Realizados</h3>
          </div>

          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${this.pagos.map(p => `
                <tr>
                  <td>${new Date(p.fecha).toLocaleDateString('es-AR')}</td>
                  <td>${p.concepto}</td>
                  <td>$${p.monto.toLocaleString()}</td>
                  <td><strong>${p.estado}</strong></td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total">
                <td colspan="2"><strong>Total Pagado</strong></td>
                <td colspan="2"><strong>$${this.totalPagado.toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          </table>

          <div class="footer">
            <p>Gracias por confiar en nuestro consultorio odontológico</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  }
}