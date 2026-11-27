import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Avance, ESTADOS_OBRA, obtenerNombreEstado } from '../models/avance.model';

@Injectable({ providedIn: 'root' })
export class PdfReporteService {
  async generarInformeAvances(avances: Avance[], nombreResponsable: string): Promise<void> {
    const doc = new jsPDF();
    const fechaActual = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // 1. Encabezado Corporativo
    doc.setFillColor(15, 23, 42); // Azul oscuro corporativo (#0f172a)
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RR CONSTRUCTIVA S.A.C.', 14, 16);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('INFORME TÉCNICO DE AVANCES Y SUPERVISIÓN DE OBRA', 14, 24);
    doc.text(`Fecha de emisión: ${fechaActual}  |  Generado por: ${nombreResponsable}`, 14, 31);

    // 2. Resumen Ejecutivo (Métricas)
     const conteos = ESTADOS_OBRA.map((est) => {
      const cant = avances.filter((a) => a.estado === est.codigo).length;
      return `${est.codigo} (${est.nombre}): ${cant}`;
    });

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`1. Resumen Ejecutivo de Ejecución (Total: ${avances.length})`, 14, 46);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    const lineasResumen = doc.splitTextToSize(conteos.join('   |   '), 182);
    doc.text(lineasResumen, 14, 52);

    // 3. Tabla Técnica de Avances
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Detalle Cronológico de Partidas y Avances', 14, 65);

    const filas = avances.map((av, index) => [
      `${index + 1}`,
      av.titulo,
      obtenerNombreEstado(av.estado),
      av.fechaRegistro ? new Date(av.fechaRegistro).toLocaleDateString('es-PE') : 'Sin fecha',
      av.descripcion,
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['#', 'Partida / Título', 'Estado', 'Fecha', 'Descripción Técnica']],
      body: filas,
      headStyles: { fillColor:'#0f172a', textColor: 255, fontStyle: 'bold' },

      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 42, fontStyle: 'bold' },
        2: { cellWidth: 28 },
        3: { cellWidth: 24 },
        4: { cellWidth: 'auto' },
      },
    });


    // 4. Anexo Fotográfico en Nueva Página
    if (avances.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
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
        doc.text(`${i + 1}. ${av.titulo} (${obtenerNombreEstado(av.estado)})`, 14, yPos);

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

    // Pie de página con numeración
    const totalPaginas = doc.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `RR Constructiva - Documento Oficial de Supervisión   |   Página ${i} de ${totalPaginas}`,
        14,
        290,
      );
    }

    doc.save(`Informe_Avances_RR_Constructiva_${new Date().toISOString().slice(0, 10)}.pdf`);
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
