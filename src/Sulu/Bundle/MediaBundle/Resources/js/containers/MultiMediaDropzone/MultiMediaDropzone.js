// @flow
import React from 'react';
import type {ElementRef} from 'react';
import {observer} from 'mobx-react';
import {action, observable} from 'mobx';
import type {IObservableValue} from 'mobx'; // eslint-disable-line import/named
import Dropzone from 'react-dropzone';
import MediaUploadStore from '../../stores/MediaUploadStore';
import MediaItem from './MediaItem';
import DropzoneOverlay from './DropzoneOverlay';
import dropzoneStyles from './dropzone.scss';

type Props = {
    children: any,
    locale: IObservableValue<string>,
    collectionId: ?string | number,
    onUpload: (media: Array<Object>) => void,
};

@observer
export default class MultiMediaDropzone extends React.Component<Props> {
    dropzoneRef: ElementRef<Dropzone>;

    @observable overlayOpen: boolean = false;

    @observable mediaUploadStores: Array<MediaUploadStore> = [];

    setDropzoneRef = (ref: Dropzone) => {
        this.dropzoneRef = ref;
    };

    @action openOverlay() {
        this.overlayOpen = true;
    }

    @action closeOverlay() {
        this.overlayOpen = false;
    }

    @action addMediaUploadStore(mediaUploadStore: MediaUploadStore) {
        this.mediaUploadStores.push(mediaUploadStore);
    }

    @action destroyMediaUploadStores() {
        this.mediaUploadStores = [];
    }

    createMediaItems() {
        return this.mediaUploadStores.map((mediaUploadStore, index) => (
            <MediaItem key={index} store={mediaUploadStore} />
        ));
    }

    handleDragEnter = () => {
        const {collectionId} = this.props;

        if (collectionId) {
            this.openOverlay();
        }
    };

    handleDragLeave = () => {
        this.closeOverlay();
    };

    handleOverlayClose = () => {
        this.closeOverlay();
    };

    handleDrop = (files: Array<File>) => {
        const {
            locale,
            collectionId,
        } = this.props;
        const uploadPromises = [];

        if (!collectionId) {
            return;
        }

        files.forEach((file) => {
            const mediaUploadStore = new MediaUploadStore(locale);
            const uploadPromise = mediaUploadStore.create(collectionId, file);

            uploadPromises.push(uploadPromise);
            this.addMediaUploadStore(mediaUploadStore);
        });

        Promise.all(uploadPromises).then((...media) => {
            this.props.onUpload(...media);

            setTimeout(() => {
                this.closeOverlay();
                this.destroyMediaUploadStores();
            }, 1000);
        });
    };

    handleOverlayClick = () => {
        this.dropzoneRef.open();
    };

    render() {
        const {children} = this.props;

        return (
            <Dropzone
                ref={this.setDropzoneRef}
                style={{}} // to disable default style
                disableClick={true}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                className={dropzoneStyles.dropzone}
            >
                <DropzoneOverlay
                    open={this.overlayOpen}
                    onClose={this.handleOverlayClose}
                    onClick={this.handleOverlayClick}
                >
                    {this.createMediaItems()}
                </DropzoneOverlay>
                {children}
            </Dropzone>
        );
    }
}
