import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface InvoicePDFModalProps {
  show: boolean;
  pdfDataUrl: string;
  onHide: () => void;
  onDownload: () => void;
  fileName?: string;
}

const InvoicePDFModal: React.FC<InvoicePDFModalProps> = ({ 
  show, 
  pdfDataUrl, 
  onHide, 
  onDownload,
  fileName = 'factura.pdf'
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered
      backdrop="static"
      style={{ zIndex: 9999 }}
    >
      <Modal.Header 
        closeButton 
        style={{ 
          borderBottom: '2px solid #dee2e6',
          backgroundColor: '#f8f9fa',
          padding: '15px 20px'
        }}
      >
        <Modal.Title style={{ fontSize: '18px', fontWeight: '600' }}>
          Imprimir - 1 página
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ padding: '0', height: '75vh', backgroundColor: '#525659' }}>
        <iframe
          ref={iframeRef}
          src={pdfDataUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: 'white'
          }}
          title="Vista previa de factura"
        />
      </Modal.Body>
      
      <Modal.Footer 
        style={{ 
          borderTop: '1px solid #dee2e6',
          backgroundColor: '#f8f9fa',
          padding: '15px 20px',
          justifyContent: 'flex-end',
          gap: '10px'
        }}
      >
        <Button 
          onClick={handlePrint}
          style={{
            backgroundColor: '#8ab4f8',
            border: 'none',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '4px',
            color: '#202124'
          }}
        >
          <i className='fa-solid fa-print me-2'></i>
          Imprimir
        </Button>
        <Button 
          onClick={onDownload}
          style={{
            backgroundColor: '#34a853',
            border: 'none',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '4px',
            color: 'white'
          }}
        >
          <i className='fa-solid fa-download me-2'></i>
          Guardar
        </Button>
        <Button 
          onClick={onHide}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #5f6368',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '4px',
            color: '#5f6368'
          }}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoicePDFModal;