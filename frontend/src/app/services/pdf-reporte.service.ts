import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Avance, ESTADOS_OBRA, obtenerNombreEstado } from '../models/avance.model';
import { Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class PdfReporteService {
  async generarInformeAvances(
    avances: Avance[],
    nombreResponsable: string,
    cliente?: Cliente | null,
  ): Promise<void> {
    const doc = new jsPDF();
    const fechaActual = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // 1. Encabezado Corporativo
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 34, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.text('RR CONSTRUCTIVA S.A.C.', 14, 15);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text('INFORME TÉCNICO DE SUPERVISIÓN Y AVANCE DE OBRA', 14, 22);
    doc.text(`Fecha de emisión: ${fechaActual}  |  Supervisor: ${nombreResponsable}`, 14, 29);

    let yCursor = 42;

    // 2. Ficha Técnica del Beneficiario (si hay cliente seleccionado)
    if (cliente) {
      const porcentaje = Math.min(100, Math.round((avances.length / 6) * 100));

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(14, yCursor - 4, 182, 30, 2, 2, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'bold');
      doc.text('DATOS DEL BENEFICIARIO Y PROYECTO', 18, yCursor + 2);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Beneficiario: ${cliente.nombre}`, 18, yCursor + 9);
      doc.text(`Código VIS: ${cliente.codigoProyecto || 'No registrado'}   |   DNI/RUC: ${cliente.ruc || '-'}`, 18, yCursor + 15);
      doc.text(`Entidad Técnica / Obra: ${cliente.proyecto} (${cliente.modalidad || 'CSP'})`, 18, yCursor + 21);

      doc.setFont('helvetica', 'bold');
      doc.text(`Avance: ${porcentaje}% (${avances.length}/6 fotos)`, 142, yCursor + 9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Ubicación: ${cliente.ubicacion || '-'}`, 142, yCursor + 15);
      doc.text(`Tel: ${cliente.telefono || '-'}`, 142, yCursor + 21);

      yCursor += 34;
    }

    // 3. Resumen Ejecutivo por Estados Oficiales (EO)
    const conteos = ESTADOS_OBRA.map((est) => {
      const cant = avances.filter((a) => a.estado === est.codigo).length;
      return `${est.codigo} (${est.nombre}): ${cant}`;
    });

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`1. Resumen Ejecutivo de Ejecución (Total Registros: ${avances.length})`, 14, yCursor);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    const lineasResumen = doc.splitTextToSize(conteos.join('   |   '), 182);
    doc.text(lineasResumen, 14, yCursor + 6);

    const inicioTabla = yCursor + 6 + lineasResumen.length * 4.5 + 4;

    // 4. Tabla Técnica de Avances
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Detalle Cronológico de Partidas y Supervisión', 14, inicioTabla);

    const filas = avances.map((av, index) => [
      `${index + 1}`,
      av.titulo,
      obtenerNombreEstado(av.estado),
      av.fechaRegistro ? new Date(av.fechaRegistro).toLocaleDateString('es-PE') : 'Sin fecha',
      av.descripcion,
    ]);

    autoTable(doc, {
      startY: inicioTabla + 4,
      head: [['#', 'Partida / Título', 'Estado (EO)', 'Fecha', 'Descripción Técnica']],
      body: filas,
      headStyles: { fillColor: '#0f172a', textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 40, fontStyle: 'bold' },
        2: { cellWidth: 34 },
        3: { cellWidth: 22 },
        4: { cellWidth: 'auto' },
      },
    });

    // 5. Anexo Fotográfico
    if (avances.length > 0) {
      doc.addPage();
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('3. Anexo de Evidencia Fotográfica en Campo', 14, 20);

      let yPos = 30;
      for (const [i, av] of avances.entries()) {
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}. ${av.titulo} — ${obtenerNombreEstado(av.estado)}`, 14, yPos);

        const base64 = await this.cargarImagenBase64(av.imagenUrl);
        if (base64) {
          doc.addImage(base64, 'JPEG', 14, yPos + 3, 75, 48);
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const lineasDesc = doc.splitTextToSize(av.descripcion, 95);
        doc.text(lineasDesc, 95, yPos + 10);

        yPos += 60;
      }
    }

    // Pie de página
    const totalPaginas = doc.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `RR Constructiva S.A.C. - Informe Oficial de Supervisión   |   Página ${i} de ${totalPaginas}`,
        14,
        290,
      );
    }

    const sufijo = cliente ? cliente.nombre.replace(/\s+/g, '_') : 'General';
    doc.save(`Informe_Obra_${sufijo}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  private async cargarImagenBase64(url: string): Promise<string | null> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }
}
