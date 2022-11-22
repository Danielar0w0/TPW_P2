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

    image?: File | null;
    image_preview: any;
    session!: Session | null;

    constructor(private usersService: UsersService, private formBuilder: FormBuilder, private modalService: NgbModal) {
        this.session = Session.getCurrentSession();
    }

    handleFileInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files as FileList;
        if (!files) return;
        this.image = files.item(0);
        this.updatePreview();
    }

    updatePreview() {
        if (this.image)
            this.image_preview.src = URL.createObjectURL(this.image);
    }

    ngOnInit(): void {
        this.image_preview = document.getElementById("image-preview")
    }

    updateProfilePic() {

        if (this.session === null || !this.image)
            return;

        this.usersService.updateProfilePic(this.session.email, this.image).subscribe({
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
