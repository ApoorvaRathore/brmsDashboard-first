import { LightningElement,api,track } from 'lwc';
import getAlignments from '@salesforce/apex/brmsdashboardController.getAlignments';
const columns = [{ label: 'Customer Id', fieldName: 'Account__c',sortable: "true"},
    { label: 'Customer Name', fieldName: 'Account_Name__c',sortable: "true"},
    { label: 'Customer Type', fieldName: 'Account_Type__c',sortable: "true"},
    { label: 'Alignment Type', fieldName: 'AxtriaSalesIQTM__Account_Alignment_Type__c',sortable: "true"},
    { label: 'Position', fieldName: 'Position__c',sortable: "true"},
    { label: 'Assignment Status', fieldName: 'AxtriaSalesIQTM__Assignment_Status__c',sortable: "true"},
    { label: 'Team', fieldName: 'team_inst__c',sortable: "true"},
    {
        type: 'button',
        label: 'Show details',
        typeAttributes: {
            
                 label: 'View Details', name: 'view_details',variant: 'base' }
            }
            
];
export default class AlignmentResult extends LightningElement {
    columns=columns;
    @api selectedAccount='' ;
    @api selectedAccountName = '';
    @api selectedTeamInstance = '';
    @api pageSize=0;
    @api recordsLoaded=0;
    @track isLoading = false;
    @track records=[];
    _loadAgain = false;

    
    connectedCallback()
    {
        console.log('Entered connectedCallback');
        this.loadMoreData(); // Load initial data
    }
    
    
    @api
    set loadAgain(value) {
        if (value) {
            console.log('🔄 Refreshing data because loadAgain is set to', value);
    
            this._loadAgain = value;
            this.records = [];  // 🔥 Clear previous results
            this.recordsLoaded = 0; // 🔥 Reset offset
            this.isLoading = false; // Ensure the flag is reset
    
            console.log('📢 Calling loadMoreData() after resetting records...');
            this.loadMoreData();  // 🔄 Fetch fresh data
        }
    }
    get loadAgain() {
        return this._loadAgain;
    }
     
    loadMoreData() 
    {
        console.log('Entered loadMoreData');
        console.log('Entered Account Number is - --',this.selectedAccount);
                console.log('Entered Account Name is -- -',this.selectedAccountName);
                console.log('Entered Team Instance is -- ',this.selectedTeamInstance);
                console.log('Limit is -- ',this.pageSize);
                console.log('offset is -- ',this.recordsLoaded);

        if (this.isLoading) 
            return;
        this.isLoading = true;


        getAlignments({accNum:this.selectedAccount|| '',accName:this.selectedAccountName|| '',teamInstance:this.selectedTeamInstance|| '' , limitvalue: this.pageSize, offsetvalue: this.recordsLoaded})
            .then((data) => {
                if (data.length > 0) {
                    this.records = [...this.records, ...data];
                    this.recordsLoaded += data.length;
                    console.log('this.recordsLoaded  is'+this.recordsLoaded );
                    console.log('this.records  is'+this.records );
                }
                this.isLoading = false;
            })
            .catch((error) => {
                console.error('Error loading data', error);
                this.isLoading = false;
            });
    }

    handleRowAction(event)
    {
    console.log('Entered handlerowaction');
    const row = event.detail.row;
    this.selectedrecord = row.Id;
    this.showdetails = true;
    this.finalaccountnumber = row.Account__c;
    this.finalaccountname = row.Account_Name__c;
    this.finalaccounttype = row.Account_Type__c;
    this.finalteam = row.team_inst__c;
    this.finalPosition = row.Position__c;
    console.log('Accountnumber of selected record is '+this.finalaccountnumber);
    console.log('id of selected record is '+this.selectedrecord);
    console.log('showdetails is '+this.showdetails);
    console.log('Team instance of selected records is'+this.finalteam);
    
    console.log('Exited handleRowAction');
    }
}