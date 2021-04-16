import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServiceService } from '../../services/customer-service.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})

export class ManageCustomerComponent implements OnInit {

  customerData = [];
  isUpdateView = false;
  customerID: number;
  customerId: number;

  queryForm: FormGroup;
  @ViewChild('DeleteConfirmationDialog', { static: false }) DeleteConfirmationDialog: TemplateRef<any>;
  @ViewChild('UpdateConfirmationDialog', { static: false }) UpdateConfirmationDialog: TemplateRef<any>;
  @ViewChild('DeleteSuccesfullyDialog', { static: false }) DeleteSuccesfullyDialog: TemplateRef<any>;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute, private customerService: CustomerServiceService,
    private router: Router, public dialog: MatDialog,) {
    this.route.params.subscribe(params => {
      if (params !== null) {
        this.customerId = params.id;
        this.getCustomerById(this.customerId);
      }
    });
  }

  ngOnInit(): void {
    this.queryForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl(''),
      href: new FormControl(''),
      status: new FormControl(''),
      type: new FormControl(''),
      statusReason: new FormControl(''),
      baseType: new FormControl(''),
      schemaLocation: new FormControl(''),
      startDateTime: new FormControl('', Validators.compose([
        Validators.required
      ])),
      endDateTime: new FormControl(''),

      account: this.formBuilder.array([]),

      paymentMethod: this.formBuilder.array(
        []),

      characteristic: this.formBuilder.array(
        []),

      relatedParty: this.formBuilder.array(
        []),

      engagedParty: this.formBuilder.array(
        []),

      agreement: this.formBuilder.array(
        []),

      creditProfile: this.formBuilder.array(
        []),

      contactMedium: this.formBuilder.array(
        []),

    });
  }

  getCustomerById(id) {

    const request = {
      "requestHeader": {
        "channel": "app",
        "requestId": "e54eb678-b7b2-11ea-b3de-0242ac130004",
        "timestamp": "2020-12-08T14:00:00Z"
      }
    }

    this.customerService.getCustomerById(id)
      .subscribe(res => {
        this.customerData = res.responseData;
        const accountData = res.responseData.account;
        const paymentMethodData = res.responseData.paymentMethod;
        const characteristicData = res.responseData.characteristic;
        const relatedPartyData = res.responseData.relatedParty;
        const engagedPartyData = res.responseData.engagedParty;
        const agreementData = res.responseData.agreement;
        const creditProfileData = res.responseData.creditProfile;
        const contactMediumData = res.responseData.contactMedium;

        this.queryForm.patchValue({
          id: res.responseData.id,
          name: res.responseData.name,
          href: res.responseData.href,
          status: res.responseData.status,
          type: res.responseData.type,
          statusReason: res.responseData.statusReason,
          baseType: res.responseData.baseType,
          schemaLocation: res.responseData.schemaLocation,
          startDateTime: res.responseData.validFor.startDateTime,
          endDateTime: res.responseData.validFor.endDateTime,
        });
        this.queryForm.setControl('account', this.setAccounts(accountData));
        this.queryForm.setControl('paymentMethod', this.setPaymentMethod(paymentMethodData));
        this.queryForm.setControl('characteristic', this.setCharacteristic(characteristicData));
        this.queryForm.setControl('relatedParty', this.setRelatedParty(relatedPartyData));
        this.queryForm.setControl('engagedParty', this.setEngagedParty(engagedPartyData));
        this.queryForm.setControl('agreement', this.setAgreement(agreementData));
        this.queryForm.setControl('creditProfile', this.setCreditProfile(creditProfileData));
        this.queryForm.setControl('contactMedium', this.setContactMedium(contactMediumData));

        console.log(this.customerData, "hh")
      }, err => {
        console.log(err);
      });
  }

  updateView() {
    this.isUpdateView = true;
  }

  // account
  get accountsListFormArray() {
    return (<FormArray>this.queryForm.get('account'));
  }

  setAccounts(accounts): FormArray {
    const formArray = new FormArray([]);
    accounts.forEach(data => {
      formArray.push(this.formBuilder.group({
        id: data.id,
        referredType: data.referredType,
        baseType: data.baseType,
        type: data.type,
        name: data.name,
        description: data.description,
        href: data.href,
        schemaLocation: data.schemaLocation,
      }));
    });

    return formArray;
  }

  addAccount() {
    this.accountsListFormArray.push(this.formBuilder.group({
      id: [''],
      referredType: [''],
      baseType: [''],
      type: [''],
      name: [''],
      description: [''],
      href: [''],
      schemaLocation: [''],
    }));
  }

  removeAccount(i: number) {
    this.accountsListFormArray.removeAt(i);
  }

  // payment
  get paymentMethodListFormArray() {
    return (<FormArray>this.queryForm.get('paymentMethod'));
  }

  setPaymentMethod(payments): FormArray {
    const formArray = new FormArray([]);
    payments.forEach(data => {
      formArray.push(this.formBuilder.group({
        id: data.id,
        referredType: data.referredType,
        baseType: data.baseType,
        type: data.type,
        name: data.name,
        href: data.href,
        schemaLocation: data.schemaLocation,
      }));
    });

    return formArray;
  }

  addPaymentMethod() {
    this.paymentMethodListFormArray.push(this.formBuilder.group({
      id: [''],
      referredType: ['CreditCardPayment'],
      baseType: [''],
      type: [''],
      name: [''],
      href: [''],
      schemaLocation: [''],
    }));
  }

  removePaymentMethod(i: number) {
    this.paymentMethodListFormArray.removeAt(i);
  }

  //characteristic
  get characteristicListFormArray() {
    return (<FormArray>this.queryForm.get('characteristic'));
  }

  setCharacteristic(characteristic): FormArray {
    const formArray = new FormArray([]);
    characteristic.forEach(data => {
      formArray.push(this.formBuilder.group({
        id: data.id,
        valueType: data.valueType,
        baseType: data.baseType,
        type: data.type,
        name: data.name,
        value: data.value,
        schemaLocation: data.schemaLocation,
      }));
    });

    return formArray;
  }

  addCharacteristic() {
    this.characteristicListFormArray.push(this.formBuilder.group({
      id: [''],
      baseType: [''],
      type: [''],
      name: [''],
      valueType: [''],
      value: [''],
      schemaLocation: [''],
    }));
  }

  removeCharacteristic(i: number) {
    this.characteristicListFormArray.removeAt(i);
  }

  // relatedParty
  get relatedPartyListFormArray() {
    return (<FormArray>this.queryForm.get('relatedParty'));
  }

  setRelatedParty(relatedParty): FormArray {
    const formArray = new FormArray([]);
    relatedParty.forEach(data => {
      formArray.push(this.formBuilder.group({
        id: data.id,
        referredType: data.referredType,
        baseType: data.baseType,
        type: data.type,
        name: data.name,
        role: data.role,
        href: data.href,
        schemaLocation: data.schemaLocation,
      }));
    });

    return formArray;
  }

  addRelatedParty() {
    this.relatedPartyListFormArray.push(this.formBuilder.group({
      id: [''],
      referredType: [''],
      baseType: [''],
      type: [''],
      name: [''],
      role: [''],
      href: [''],
      schemaLocation: [''],
    }));
  }

  removeRelatedParty(i: number) {
    this.relatedPartyListFormArray.removeAt(i);
  }

  // engagedParty
  get engagedPartyListFormArray() {
    return (<FormArray>this.queryForm.get('engagedParty'));
  }

  setEngagedParty(engagedParty): FormArray {
    const formArray = new FormArray([]);
    engagedParty.forEach(data => {
      formArray.push(this.formBuilder.group({
        id: data.id,
        referredType: data.referredType,
        baseType: data.baseType,
        type: data.type,
        name: data.name,
        role: data.role,
        href: data.href,
        schemaLocation: data.schemaLocation,
      }));
    });

    return formArray;
  }

  addEngagedParty() {
    this.engagedPartyListFormArray.push(this.formBuilder.group({
      id: [''],
      referredType: [''],
      baseType: [''],
      type: [''],
      name: [''],
      role: [''],
      href: [''],
      schemaLocation: [''],
    }));
  }

  removeEngagedParty(i: number) {
    this.engagedPartyListFormArray.removeAt(i);
  }

  // agreement
  get agreementListFormArray() {
    return (<FormArray>this.queryForm.get('agreement'));
  }

  setAgreement(agreement): FormArray {
    const formArray = new FormArray([]);
    agreement.forEach(data => {
      formArray.push(this.formBuilder.group({
        id: data.id,
        referredType: data.referredType,
        baseType: data.baseType,
        type: data.type,
        name: data.name,
        href: data.href,
        schemaLocation: data.schemaLocation,
      }));
    });

    return formArray;
  }

  addAgreement() {
    this.agreementListFormArray.push(this.formBuilder.group({
      id: [''],
      referredType: [''],
      baseType: [''],
      type: [''],
      name: [''],
      href: [''],
      schemaLocation: [''],
    }));
  }

  removeAgreement(i: number) {
    this.agreementListFormArray.removeAt(i);
  }

  // creditProfile
  get creditProfileListFormArray() {
    return (<FormArray>this.queryForm.get('creditProfile'));
  }

  setCreditProfile(creditProfile) {
    const formArray = new FormArray([]);
    creditProfile.forEach(data => {
      formArray.push(this.formBuilder.group({
        creditProfileId: data.id,
        creditProfileDate: data.creditProfileDate,
        creditProfilecreditScore: data.creditScore,
        creditProfilecreditRiskRating: data.creditRiskRating,
        creditProfileType: data.type,
        creditProfileBaseType: data.baseType,
        creditProfileSchemaLocation: data.schemaLocation,
        creditProfileStartDateTime: data.validFor.startDateTime,
        creditProfileEndDateTime: data.validFor.endDateTime,
      }));
    });

    return formArray;
  }

  addCreditProfile() {
    this.creditProfileListFormArray.push(this.formBuilder.group({
      creditProfileId: [''],
      creditProfileDate: [''],
      creditProfilecreditScore: [''],
      creditProfilecreditRiskRating: [''],
      creditProfileType: [''],
      creditProfileBaseType: [''],
      creditProfileSchemaLocation: [''],
      creditProfileStartDateTime: [''],
      creditProfileEndDateTime: [''],
    }));
  }

  removeCreditProfile(i: number) {
    this.creditProfileListFormArray.removeAt(i);
  }

  // contactMedium
  get contactMediumListFormArray() {
    return (<FormArray>this.queryForm.get('contactMedium'));
  }

  setContactMedium(contactMedium) {
    const formArray = new FormArray([]);
    contactMedium.forEach(data => {
      formArray.push(this.formBuilder.group({
        contactMediumId: data.id,
        contactMediumMediumType: data.mediumType,
        contactMediumPreferred: data.preferred,
        contactMediumBaseType: data.baseType,
        contactMediumReferredType: data.referredType,
        contactMediumSchemaLocation: data.schemaLocation,
        contactMediumStartDateTime: data.validFor.startDateTime,
        contactMediumEndDateTime: data.validFor.endDateTime,

        // contact medium characteristics
        contactMediumCharacteristicId: data.characteristic.id,
        contactMediumCharacteristicCountry: data.characteristic.country,
        contactMediumCharacteristiCity: data.characteristic.city,
        contactMediumCharacteristicContactType: data.characteristic.contactType,
        contactMediumCharacteristicSocialNetworkId: data.characteristic.socialNetworkId,
        contactMediumCharacteristicEmailAddress: data.characteristic.emailAddress,
        contactMediumCharacteristicPhoneNumber: data.characteristic.phoneNumber,
        contactMediumCharacteristicStateOrProvince: data.characteristic.stateOrProvince,
        contactMediumCharacteristicFaxNumber: data.characteristic.faxNumber,
        contactMediumCharacteristicPostCode: data.characteristic.postCode,
        contactMediumCharacteristicStreet1: data.characteristic.street1,
        contactMediumCharacteristicStreet2: data.characteristic.street2,
        contactMediumCharacteristicSchemaLocation: data.characteristic.schemaLocation,
        contactMediumCharacteristicType: data.characteristic.type,
        contactMediumCharacteristicBaseType: data.characteristic.baseType,
      }));
    });

    return formArray;
  }

  addContactMedium() {
    this.contactMediumListFormArray.push(this.formBuilder.group({
      contactMediumId: [''],
      contactMediumMediumType: [''],
      contactMediumPreferred: [''],
      contactMediumBaseType: [''],
      contactMediumReferredType: [''],
      contactMediumSchemaLocation: [''],
      contactMediumStartDateTime: [''],
      contactMediumEndDateTime: [''],

      // contact medium characteristics
      contactMediumCharacteristicId: [''],
      contactMediumCharacteristicCountry: [''],
      contactMediumCharacteristiCity: [''],
      contactMediumCharacteristicContactType: [''],
      contactMediumCharacteristicSocialNetworkId: [''],
      contactMediumCharacteristicEmailAddress: [''],
      contactMediumCharacteristicPhoneNumber: [''],
      contactMediumCharacteristicStateOrProvince: [''],
      contactMediumCharacteristicFaxNumber: [''],
      contactMediumCharacteristicPostCode: [''],
      contactMediumCharacteristicStreet1: [''],
      contactMediumCharacteristicStreet2: [''],
      contactMediumCharacteristicSchemaLocation: [''],
      contactMediumCharacteristicType: [''],
      contactMediumCharacteristicBaseType: [''],
    }));
  }

  removeContactMedium(i: number) {
    this.contactMediumListFormArray.removeAt(i);
  }

  // update customer
  onFormSubmit(value: any) {

    const creditProfileList = [];
    const contactMediumList = [];

    value.creditProfile &&
      value.creditProfile.map((item) => {
        const profile = {
          id: item.creditProfileId,
          creditProfileDate: item.creditProfileDate,
          creditScore: item.creditProfilecreditScore,
          baseType: item.creditProfileBaseType,
          type: item.creditProfileType,
          creditRiskRating: item.creditProfilecreditRiskRating,
          schemaLocation: item.creditProfileSchemaLocation,
          validFor: {
            startDateTime: item.creditProfileStartDateTime,
            endDateTime: item.creditProfileEndDateTime,
          }
        };
        creditProfileList.push(profile);
      });


    value.contactMedium &&
      value.contactMedium.map((item) => {
        const contact = {
          id: item.contactMediumId,
          mediumType: item.contactMediumMediumType,
          preferred: item.contactMediumPreferred,
          baseType: item.contactMediumBaseType,
          referredType: item.contactMediumReferredType,
          schemaLocation: item.contactMediumSchemaLocation,
          validFor: {
            startDateTime: item.contactMediumStartDateTime,
            endDateTime: item.contactMediumEndDateTime,
          },
          characteristic: {
            id: item.contactMediumCharacteristicId,
            country: item.contactMediumCharacteristicCountry,
            city: item.contactMediumCharacteristiCity,
            contactType: item.contactMediumCharacteristicContactType,
            socialNetworkId: item.contactMediumCharacteristicSocialNetworkId,
            emailAddress: item.contactMediumCharacteristicEmailAddress,
            phoneNumber: item.contactMediumCharacteristicPhoneNumber,
            stateOrProvince: item.contactMediumCharacteristicStateOrProvince,
            faxNumber: item.contactMediumCharacteristicFaxNumber,
            postCode: item.contactMediumCharacteristicPostCode,
            street1: item.contactMediumCharacteristicStreet1,
            street2: item.contactMediumCharacteristicStreet2,
            schemaLocation: item.contactMediumCharacteristicSchemaLocation,
            type: item.contactMediumCharacteristicType,
            baseType: item.contactMediumCharacteristicBaseType,
          }
        };
        contactMediumList.push(contact);
      });

    const request = {
      "customer": {
        "id": value.id,
        "@type": value.type,
        "href": value.href,
        "name": value.name,
        "status": value.status,
        "statusReason": value.statusReason,
        "baseType": value.baseType,
        "schemaLocation": value.schemaLocation,
        "validFor": {
          "startDateTime": value.startDateTime,
          "endDateTime": value.endDateTime,
        },
        "engagedParty": value.engagedParty,
        "account": value.account,
        "paymentMethod": value.paymentMethod,
        "agreement": value.agreement,
        "relatedParty": value.relatedParty,
        "characteristic": value.characteristic,
        "contactMedium": contactMediumList,
        "creditProfile": creditProfileList,
        "requestHeader": {
          "channel": "web",
          "requestId": "qadsf-sd23fsd-ffgss-fdsff",
          "timestamp": "2020-02-24T14:40:00"
        }
      }
    }

    this.customerService.updateCustomer(this.customerId, request)
      .subscribe(res => {
        this.updateConfirmation();
      }, (err) => {
        console.log("error");
      });
  }

  // ask for confirmation to delete
  userDeleteConfirmation() {
    const dialogRef = this.dialog.open(this.DeleteConfirmationDialog,
      {
        width: '100px',
        panelClass: 'confirmation-modal',
        backdropClass: 'server-selection-model-overlay',
        disableClose: true
      }
    );
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  // delete customer
  deleteCustomer() {
    this.customerService.deleteCustomer(this.customerId)
      .subscribe(res => {
        this.succesfullyDeleted();
      }, (err) => {
        console.log("error");
      });
  }

  // display delete successful modal
  succesfullyDeleted() {
    const dialogRef = this.dialog.open(this.DeleteSuccesfullyDialog,
      {
        width: '100px',
        panelClass: 'confirmation-modal',
        backdropClass: 'server-selection-model-overlay',
        disableClose: true
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([''])
    })
  }

  // display update successful modal
  updateConfirmation() {
    const dialogRef = this.dialog.open(this.UpdateConfirmationDialog,
      {
        width: '100px',
        panelClass: 'confirmation-modal',
        backdropClass: 'server-selection-model-overlay',
        disableClose: true
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate([''])
    })
  }

}
