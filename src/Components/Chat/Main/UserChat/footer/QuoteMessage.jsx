import React from 'react'
import { getBackgroundColorClass } from '../UserChat'

export const QuoteMessage = ({ quoteMessage, onCloseQuoteHandler }) => {
    return (
        <div className="quote-message row m-0">
            <div className="message overflow-hidden">
                <div className="message-wrapper">
                    <div className={`message-content ${!quoteMessage?.isMessage ? 'border-white' : ''} ${getBackgroundColorClass("q-" + quoteMessage.type)}`}>
                        {!quoteMessage.mediaType ? <>
                            {quoteMessage.subject && <h6 className='font-weight-bold message-subject text-truncate'>{`Subject: ${quoteMessage.subject}`}</h6>}
                            {quoteMessage.patient && <h6 className='font-weight-medium message-patient text-truncate'>{`Patient: ${quoteMessage.patient}`}</h6>}
                            <span className='font-weight-lighter text-truncate'>{`${quoteMessage.subject || quoteMessage.patient ? (quoteMessage.isMessage ? 'Message:' : 'Task:') : ''} ${quoteMessage.message}`}</span></>
                            : <>
                                <div className="contacts-texts row m-0">
                                    {quoteMessage.mediaType.split("/")[0] === "image" && <svg className="hw-20 text-muted mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path>
                                    </svg>}
                                    {quoteMessage.mediaType.split("/")[0] === "video" && <svg className="hw-20 text-muted mr-1" height="20" width="20" fill="currentColor">
                                        <path d="M3.417 16.667Q2.688 16.667 2.177 16.156Q1.667 15.646 1.667 14.917V5.083Q1.667 4.354 2.177 3.844Q2.688 3.333 3.417 3.333H13.25Q13.979 3.333 14.49 3.844Q15 4.354 15 5.083V8.646L18.333 5.312V14.688L15 11.354V14.917Q15 15.646 14.49 16.156Q13.979 16.667 13.25 16.667ZM3.417 14.917H13.25Q13.25 14.917 13.25 14.917Q13.25 14.917 13.25 14.917V5.083Q13.25 5.083 13.25 5.083Q13.25 5.083 13.25 5.083H3.417Q3.417 5.083 3.417 5.083Q3.417 5.083 3.417 5.083V14.917Q3.417 14.917 3.417 14.917Q3.417 14.917 3.417 14.917ZM3.417 14.917Q3.417 14.917 3.417 14.917Q3.417 14.917 3.417 14.917V5.083Q3.417 5.083 3.417 5.083Q3.417 5.083 3.417 5.083Q3.417 5.083 3.417 5.083Q3.417 5.083 3.417 5.083V14.917Q3.417 14.917 3.417 14.917Q3.417 14.917 3.417 14.917Z" />
                                    </svg>}
                                    {quoteMessage.mediaType.split("/")[0] === "audio" && <svg className="hw-20 text-muted mr-1" height="20" width="20" fill="currentColor">
                                        <path d="M10.021 11.792Q8.958 11.792 8.198 11.031Q7.438 10.271 7.438 9.208V4.229Q7.438 3.167 8.198 2.417Q8.958 1.667 10.021 1.667Q11.083 1.667 11.833 2.417Q12.583 3.167 12.583 4.229V9.208Q12.583 10.271 11.833 11.031Q11.083 11.792 10.021 11.792ZM10.021 6.729Q10.021 6.729 10.021 6.729Q10.021 6.729 10.021 6.729Q10.021 6.729 10.021 6.729Q10.021 6.729 10.021 6.729Q10.021 6.729 10.021 6.729Q10.021 6.729 10.021 6.729Q10.021 6.729 10.021 6.729Q10.021 6.729 10.021 6.729ZM9.146 17.5V15Q6.979 14.708 5.573 13.062Q4.167 11.417 4.167 9.208H5.917Q5.917 10.917 7.115 12.115Q8.312 13.312 10.021 13.312Q11.708 13.312 12.906 12.115Q14.104 10.917 14.104 9.208H15.854Q15.854 11.417 14.458 13.062Q13.062 14.708 10.896 15V17.5ZM10.021 10.042Q10.375 10.042 10.604 9.802Q10.833 9.562 10.833 9.208V4.229Q10.833 3.875 10.604 3.646Q10.375 3.417 10.021 3.417Q9.667 3.417 9.427 3.646Q9.188 3.875 9.188 4.229V9.208Q9.188 9.562 9.427 9.802Q9.667 10.042 10.021 10.042Z" />
                                    </svg>}
                                    {quoteMessage.mediaType.split("/")[0] === "application" && <svg className="hw-20 text-muted mr-1" height="20" width="20" fill="currentColor">
                                        <path d="M6.667 15.042H13.333V13.292H6.667ZM6.667 11.75H13.333V10H6.667ZM5.083 18.333Q4.354 18.333 3.844 17.823Q3.333 17.312 3.333 16.583V3.417Q3.333 2.688 3.844 2.177Q4.354 1.667 5.083 1.667H11.583L16.667 6.75V16.583Q16.667 17.312 16.156 17.823Q15.646 18.333 14.917 18.333ZM10.708 7.625V3.417H5.083Q5.083 3.417 5.083 3.417Q5.083 3.417 5.083 3.417V16.583Q5.083 16.583 5.083 16.583Q5.083 16.583 5.083 16.583H14.917Q14.917 16.583 14.917 16.583Q14.917 16.583 14.917 16.583V7.625ZM5.083 3.417V7.625V3.417V7.625V16.583Q5.083 16.583 5.083 16.583Q5.083 16.583 5.083 16.583Q5.083 16.583 5.083 16.583Q5.083 16.583 5.083 16.583V3.417Q5.083 3.417 5.083 3.417Q5.083 3.417 5.083 3.417Z" />
                                    </svg>}
                                    <p className="text-truncate">{quoteMessage.fileName}</p>
                                </div>
                            </>}
                    </div>
                </div>
            </div>
            <div data-appcontent-close="" onClick={onCloseQuoteHandler}>
                <svg className="hw-22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
        </div>
    )
}
