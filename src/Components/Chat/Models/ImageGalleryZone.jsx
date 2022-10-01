import React, { useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeModel } from '../../../redux/actions/modelAction';
import { IMAGE_GALLERY } from './models';
import ReactImageVideoLightbox from "react-image-video-lightbox";
import { IMAGE_INDEX } from '../../../redux/constants/chatConstants';

export const ImageGalleryZone = () => {
    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.model);
    const { imageId, mediaFiles } = useSelector((state) => state.chat);
    const [mediaList, setMediaList] = useState([]);

    useLayoutEffect(() => {
        setMediaList(mediaFiles.map((item) => {
            const itemType = item.mediaType.split("/").shift();
            if (itemType === "video")
                return {
                    ...item,
                    url: item.mediaUrl,
                    type: "video",
                    title: 'video title'
                }
            return {
                ...item,
                url: item.mediaUrl,
                type: "photo",
                altTag: 'Alt Photo'
            }
        }));
    }, [imageId, mediaFiles, name]);

    const onCloseHandler = () => {
        dispatch(changeModel(""));
        dispatch({ type: IMAGE_INDEX, payload: 0 });
    }

    return (<div className={`modal modal-lg-fullscreen fade ${name === IMAGE_GALLERY ? 'show d-block' : ''}`} id="imageGallery" tabIndex={-1} role="dialog" aria-labelledby="dropZoneLabel" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => dispatch(changeModel(""))}>
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body image-video-gallery">
                    <ReactImageVideoLightbox
                        data={mediaList}
                        startIndex={mediaFiles.findIndex((item) => item.id === imageId)}
                        showResourceCount={true}
                        onCloseCallback={onCloseHandler}
                        onNavigationCallback={(currentIndex) => {
                            // setIndex(currentIndex);
                        }}
                    />
                </div>
            </div>
        </div>
    </div>);
}
