import {Component, OnInit} from '@angular/core';
import {UsersService} from "../services/users/users.service";
import {Session} from "../utils/session";
import {FormBuilder} from "@angular/forms";
import {InfoModalComponent} from "../info-modal/info-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-edit-profile-root',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    image: any;
    image_preview: any;
    session!: Session | null;

    pictureForm = this.formBuilder.group({
        file: ''
    });

    constructor(private usersService: UsersService, private formBuilder: FormBuilder, private modalService: NgbModal) {
        this.session = Session.getCurrentSession();
    }

    updatePreview() {
        this.image_preview.src = URL.createObjectURL(this.image.files[0]);
    }

    ngOnInit(): void {
        this.image = document.getElementById("image");
        this.image_preview = document.getElementById("image-preview")
    }

    updateProfilePic() {

        if (this.session === null || this.pictureForm.get('file') === null)
            return;

        // @ts-ignore
        if (this.pictureForm.get('file').value === null)
            return;

        // @ts-ignore
        let file = this.pictureForm.get('file').value

        this.usersService.updateProfilePic(this.session.email, file).subscribe({
            error: () => {
                const infoModal = this.modalService.open(InfoModalComponent);
                infoModal.componentInstance.title = 'Profile Picture';
                infoModal.componentInstance.body = 'Error updating profile picture.';
            },
            complete: () => {
                const infoModal = this.modalService.open(InfoModalComponent);
                infoModal.componentInstance.title = 'Profile Picture';
                infoModal.componentInstance.body = 'Successfully updated profile picture';
            }
        })
    }
}
