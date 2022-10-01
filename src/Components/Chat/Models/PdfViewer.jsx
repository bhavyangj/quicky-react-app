import React, { useState } from 'react'
import { Page, Document, pdfjs } from 'react-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { SET_PDF_URL } from '../../../redux/constants/chatConstants';
import { PDF_VIEWER } from './models';
import { ReactComponent as DownloadSvg } from '../../../assets/media/heroicons/outline/download.svg';
import { handleDownload } from '../Main/UserChat/message/MessageDropDown';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

export const PdfViewer = () => {
    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.model);
    const { pdfUrl } = useSelector((state) => state.chat);
    const [numPages, setNumPages] = useState(null);
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }
    const onCloseHanlder = () => {
        dispatch(changeModel(""));
        dispatch({ type: SET_PDF_URL, payload: "", fileName: null });
    }
    return (<>
        <div className={`modal modal-lg-fullscreen fade ${name === PDF_VIEWER ? 'show d-block' : ''}`} id="pdfViewer" tabIndex={-1} role="dialog" aria-labelledby="dropZoneLabel" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header justify-content-between">
                        <h5 className="modal-title" id="startConversationLabel">PDF File</h5>
                        <div>
                            <button type="button" className="btn btn-info p-4_8 ml-auto" onClick={() => handleDownload(pdfUrl.url, pdfUrl.filename)}>
                                <DownloadSvg />
                                <span className='ml-1'>Download</span>
                            </button>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => onCloseHanlder()}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                    </div>
                    <div className="modal-body p-0 hide-scrollbar">
                        <div className="row justify-content-center text-white">
                            <div className='col-12'>
                                <Document file={pdfUrl.url} options={{ workerSrc: "/pdf.worker.js" }} onLoadSuccess={onDocumentLoadSuccess} >
                                    <div className="my-1">
                                        {Array.from(new Array(numPages), (el, index) => (
                                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                                        ))}
                                    </div>
                                </Document>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
}
