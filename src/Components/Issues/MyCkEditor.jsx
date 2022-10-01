import React from 'react'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor-advance-plugins';
import { onUploadImage, uploadToS3 } from '../../utils/s3/s3Connection';

export const MyCkEditor = ({ name, value, onChange, placeHolder }) => {


    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    loader.file.then((file) => {
                        onUploadImage(file).then((presignedUrl) => {
                            uploadToS3(presignedUrl, file).then((url) => {
                                resolve({
                                    default: url
                                });
                            })
                        }).catch((error) => {
                            console.log(error);
                        });
                    });
                });
            }
        };
    }
    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }

    return (
        <div className='text-black'>
            <CKEditor
                editor={Editor}
                name={name}
                data={value}
                config={{
                    extraPlugins: [uploadPlugin],
                    placeholder: placeHolder
                }}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
                onBlur={(event, editor) => {
                    // console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    // console.log('Focus.', editor);
                }}
            />
        </div>
    )
}
