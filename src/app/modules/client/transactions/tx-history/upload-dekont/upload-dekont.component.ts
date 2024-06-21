import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector:'upload-dekont',
    templateUrl:'upload-dekont.component.html',
    styleUrls:['upload-dekont.component.scss']
})
export class UploadDekontComponent{

    constructor(private modal:NgbModal){

    }
dekont:File
    addFile(event) {
        this.dekont = event.target.files[0]
        this.handleInputChange(this.dekont)
    }


    handleInputChange(file) {
        var file = file;
        // var pattern = /image-*\/application-*/;
        var reader = new FileReader();
        // if (!file.type.match(pattern)) {
        //     alert('invalid format');
        //     return;
        // }
        reader.onloadend = this._handleReaderLoaded.bind(this);
        return reader.readAsDataURL(file);
    }
    _handleReaderLoaded(e) {
        let reader = e.target;
        var base64result = reader.result
       
        this.modal.dismissAll(base64result)



    }
    close(){
        this.modal.dismissAll()
    }
}