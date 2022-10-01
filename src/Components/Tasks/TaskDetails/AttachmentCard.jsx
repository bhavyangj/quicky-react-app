import React from "react";
import classes from "./TaskDetails.module.css";
import { ReactComponent as EllipsisSvg } from "../../../assets/media/heroicons/outline/dots-horizontal.svg";
import { IMAGE, IMAGE_INDEX, VIDEO } from "../../../redux/constants/chatConstants";

export default function AttachmentCard({ att, dispatch, attchmentDeleteHandler, setImageShow }) {
	const onClickImageHandler = () => {
		dispatch({ type: IMAGE_INDEX, payload: att.id });
		setImageShow(true);
	}
	const itemType = att?.mediaType.split("/").shift();
	return (
		<div className="card p-1 my-1 mr-2">
			<div className="card-title text-right m-0">
				<div className="dropdown d-flex justify-content-end">
					<button className="btn nav-link text-muted p-0" id={`Attachment-${att.id}`} data-bs-toggle="dropdown">
						<EllipsisSvg id={`task`} />
					</button>
					<ul className="dropdown-menu m-0" aria-labelledby={`Attachment-${att.id}`}>
						<a href={att.mediaUrl} target="_blank" className="dropdown-item" rel="noreferrer" download>Download</a>
						<li className="dropdown-item" onClick={() => { navigator.clipboard.writeText(att?.mediaUrl) }}>
							Copy Link
						</li>
						<li className="dropdown-item" onClick={() => { attchmentDeleteHandler(att.id); }}>
							Delete Attachment
						</li>
					</ul>
				</div>
			</div>
			{itemType === IMAGE && <div className={classes["attached-img-box"]}>
				<img src={att?.mediaUrl} alt="attachment" className="attachment-image" onClick={() => onClickImageHandler()} />
				<p className="mb-0 mt-1" style={{ fontSize: '12px' }}>{att.fileName}</p>
			</div>}
			{itemType === VIDEO && <div className={classes["attached-img-box"]}>
				<video width="320" height="240" alt="attachment" className="attachment-image m-auto" onClick={() => onClickImageHandler()}>
					<source src={att?.mediaUrl} type="video/mp4" />
					<source src={att?.mediaUrl} type="video/ogg" />
					Your browser does not support the video tag.
				</video>
				<p className="mb-0 mt-1" style={{ fontSize: '12px' }}>{att.fileName}</p>
			</div>}
			{![IMAGE, VIDEO].includes(itemType) && <div className={classes["attached-img-box"]}>
				<div className="document">
					<div className="document-body">
						<ul className="list-inline small mb-0">
							<li className="list-inline-item">
								<span className="text-muted text-uppercase">{att?.mediaType?.split("/").pop()}</span>
							</li>
						</ul>
						<p className="mb-0 mt-1 text-muted" style={{ fontSize: '12px' }}>{att.fileName}</p>
					</div>
				</div>
			</div>}
		</div>
	);
}
