"use strict";
import React from 'react'
import ReactDOM from 'react-dom'

var SampleModal = React.createClass({
    render: function() {
        return (
            <div className="modal fade" tabindex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">Title</h4>
                        </div>
                        <div className="modal-body">
                            <p>Modal content</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var sampleModalId = 'sample-modal-container';
var SampleApp = React.createClass({
    handleShowSampleModal: function() {
        var modal = React.cloneElement(<SampleModal></SampleModal>);
        var modalContainer = document.createElement('div');
        modalContainer.id = sampleModalId;
        document.body.appendChild(modalContainer);
        ReactDOM.render(modal, modalContainer, function() {
            var modalObj = $('#'+sampleModalId+'>.modal');
            modalObj.modal('show');
            modalObj.on('hidden.bs.modal', this.handleHideSampleModal);
        }.bind(this));
    },
    handleHideSampleModal: function() {
        $('#'+sampleModalId).remove();
    },
    render: function(){
        return (
            <div>
                <a href="javascript:;" onClick={this.handleShowSampleModal}>show modal</a>
            </div>
        )
    }
});

module.exports = SampleApp;