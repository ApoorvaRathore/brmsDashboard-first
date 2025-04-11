import { LightningElement,wire,track } from 'lwc';
import getAccounts from '@salesforce/apex/brmsdashboardController.getAccounts';
import getAccountsNames from '@salesforce/apex/brmsdashboardController.getAccountsNames';
import getTeamInstance from '@salesforce/apex/brmsdashboardController.getTeamInstance';
import getAlignments from '@salesforce/apex/brmsdashboardController.getAlignments';
import getAccountDetails from '@salesforce/apex/brmsdashboardController.getAccountDetails';
import getProdRestriction from '@salesforce/apex/brmsdashboardController.getProdRestriction';
const DELAY = 1000;
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

export default class SearchComp extends LightningElement {
    
    accNum='';
    accNumbers;
    accName = '';
    sizeofaccNumbers=0;
    sizeofaccNames =0;
    selectedAccount='';
    selectedAccountName='';
    showSelectedAccount = false;
    showSelectedAccountName = false;
    teamInstances;
    showTeamInstance = false;
    selectedTeamInstance=null;
    disableCustomerID = false;
    disableCustomerName = false;
    @track showAlignmentResults = false;
    @track searchResults=[];
    @track error=null;
    pageSize=3;
    recordsLoaded=0;
    loadAgain = false;
    columns = columns;
    showdetails= false;
    timerId = 0;
    @track results=[]
    @track records=[];
    @track firstTime =false;
    @track Prresponse=[];
    lastId ='';
    accChangeHandler(event) {
        console.log('Entered accChangeHandler');
        let enteredAccNum = event.target.value;
        // Clear any existing timeout before setting a new one
        clearTimeout(this.timerId);
        
        
        
    
        // Set a new timeout
        this.timerId = setTimeout(() => {this.accNum = enteredAccNum;
            if(enteredAccNum!='')
                {
                this.disableCustomerID = false;
                this.disableCustomerName = true;
                }
                else{
                this.disableCustomerID = false;
                this.disableCustomerName = false;
                }
                console.log('this.disableCustomerID is ---',this.disableCustomerID);
                console.log('this.disableCustomerName is ---',this.disableCustomerName);
        }, DELAY);
    }
    accNameChangeHandler(event) {
        let enteredAccName = event.target.value;

        
        // Clear any existing timeout before setting a new one
        clearTimeout(this.timerId1);
    
        // Set a new timeout
        this.timerId1 = setTimeout(() => {this.accName = enteredAccName;
            if(enteredAccName!='')
                {
                    this.disableCustomerID = true;
                    this.disableCustomerName = false;
                }
                else{
                    this.disableCustomerID = false;
                    this.disableCustomerName = false;
                    }
            console.log('this.disableCustomerID is ---',this.disableCustomerID);
            console.log('this.disableCustomerName is ---',this.disableCustomerName);
        }, DELAY);
    }
    loadMoreAccount(event)
    {
        console.log('Entered loadMoreAccount');
    
    }


    @wire (getAccounts,{accNum:"$accNum"}) accOutputs({data,error})
    {
        if(data)
        {
            this.accNumbers=data;
            console.log('Accounts received:',data);
            this.sizeofaccNumbers=this.accNumbers.length;
            console.log('sizeofaccNumbers is -- ',this.sizeofaccNumbers);
            this.showSelectedAccount = false;
        }
        else if(error)
        {
            console.error('Error fetching accounts:', error);
        }
    }
    @wire (getAccountsNames,{accName:"$accName"}) accNamesOutputs({data,error})
    {
        if(data)
        {
            this.accNames=data;
            console.log('Accounts received:',data);
            this.sizeofaccNames=this.accNames.length;
            console.log('sizeofaccNumbers is -- ',this.sizeofaccNames);
            this.showSelectedAccountName = false;
        }
        else if(error)
        {
            console.error('Error fetching accounts:', error);
        }
    }
    @wire(getTeamInstance,{}) teamInstanceList({data,error})
    {
        if(data)
        {
            this.teamInstances=data;
            console.log('Team Instances received:',data);
        }
        else if(error)
        {
            console.error('Error fetching Team Instance:', error); 
        }
    }

    accountSelectedHandler(event)
    {
        this.selectedAccount = event.target.title;
        console.log('Account Selected is --- ',event.target.title);
        this.sizeofaccNumbers = 0;
        this.showSelectedAccount = true;

    }
    accountNameSelectedHandler(event)
    {
        this.selectedAccountName = event.target.title;
        console.log('Account Name Selected is --- ',event.target.title);
        this.sizeofaccNames = 0;
        this.showSelectedAccountName = true;

    }
    closeAccountList(event)
    {
        this.selectedAccount = '';
        this.sizeofaccNumbers = 0;
        this.showSelectedAccount = false;
        this.accNum = '';
        this.disableCustomerID = false;
        this.disableCustomerName = false;
    }
    closeAccountNameList(event)
    {
        this.selectedAccountName = '';
        this.sizeofaccNamess = 0;
        this.showSelectedAccountName = false;
        this.accName = '';
        this.disableCustomerID = false;
        this.disableCustomerName = false;
    }
    closeteamInstanceList(event)
    {
        this.showTeamInstance = false;
        this.selectedTeamInstance=null;
        //this.teamInstances = null;
    }
    showTeamInstanceHandler(event)
    {
        this.showTeamInstance = true;
        console.log('this.showTeamInstance is',this.showTeamInstance);
    }
    teamInstanceSelectedHandler(event)
    {
        this.selectedTeamInstance = event.target.title;
        console.log('Selected team instance is --- ',event.target.title);
        this.showTeamInstance = false;
    }


    performSearch(event)
    {
        console.log('##### Entered Search #####');
        console.log('Entered Account Number is --',this.selectedAccount);
        console.log('Entered Account Name is -- ',this.selectedAccountName);
        console.log('Entered Team Instance is -- ',this.selectedTeamInstance);
        console.log('Limit is -- ',this.pageSize);
        console.log('offset is -- ',this.recordsLoaded);
        if(this.selectedAccount == '' && this.selectedAccountName =='' && this.selectedTeamInstance == null)
        {
            alert('Please select atleast one field to perform search');
            return;
        }
        
        else
        {
            console.log('Entered performSearch');
            this.showAlignmentResults = true;
            this.loadAgain = true;
            console.log('loadAgain is ',this.loadAgain);
            console.log('Exited performSearch');
            this.firstTime =true;
            if(this.firstTime == true)
            {
                console.log('Entered firsttime');
                this.recordsLoaded = 0;
                this.records = [];
                console.log('this.recordsLoaded is ---- '+this.recordsLoaded);
                console.log('this.records is ---- '+this.records);
                this.loadDataTable();
            }
        }
    }
    performClearSearch(event)
    {
        console.log('##### Entered Clear Search #####');
        this.disableCustomerID = false;
        this.disableCustomerName = false;
        this.selectedAccount = '';
        this.sizeofaccNumbers = 0;
        this.showSelectedAccount = false;
        this.accNum = '';
        this.selectedAccountName = '';
        this.sizeofaccNamess = 0;
        this.showSelectedAccountName = false;
        this.accName = '';
        this.showTeamInstance = false;
        this.selectedTeamInstance=null;
        this.showAlignmentResults = false;
        this.loadAgain = false;
    }
    loadDataTable(event)
        {
            console.log('#### Entered loadDataTable ####');
            console.log('Entered Account Number is - --',this.selectedAccount);
            console.log('Entered Account Name is -- -',this.selectedAccountName);
            console.log('Entered Team Instance is -- ',this.selectedTeamInstance); 
            getAlignments({accNum:this.selectedAccount|| '',accName:this.selectedAccountName|| '',teamInstance:this.selectedTeamInstance|| ''})
                .then((data) => {
                    if (data.length > 0) 
                    {
                        this.records = [...this.records, ...data];
                        this.recordsLoaded += data.length;
                        console.log('this.recordsLoaded  is'+this.recordsLoaded );
                        console.log('this.records  is'+this.records );
                    }
                    
                })
                .catch((error) => {
                    console.error('Error loading data', error);
                    this.isLoading = false;
                });  
        }
    
    loadMoreData() 
        {
            console.log('#### Entered loadMoreData ####');
            console.log('Entered Account Number is - --',this.selectedAccount);
            console.log('Entered Account Name is -- -',this.selectedAccountName);
            console.log('Entered Team Instance is -- ',this.selectedTeamInstance);
            

    
            getAlignments({accNum:this.selectedAccount|| '',accName:this.selectedAccountName|| '',teamInstance:this.selectedTeamInstance|| '' , lastId: this.lastId})
                .then((data) => {
                    if (data.length > 0) {
                        this.records = [...this.records, ...data];
                        this.recordsLoaded += data.length;
                        console.log('this.recordsLoaded  is'+this.recordsLoaded );
                        console.log('this.records  is'+this.records );
                    }
                    
                })
                .catch((error) => {
                    console.error('Error loading more data', error);
                   
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
        
        getAccountDetails({accNum:this.finalaccountnumber})
        .then((data) => {
            this.results = data;
        })
        .catch((error) => {
            console.error('Error while loading Account details', error);
        });


        console.log('Exited handleRowAction');
        }
    hideModalBox()
    {
        this.showdetails = false;
    }
    downloadCSV(event)
    {
        const refinedData = [];
        this.records.forEach(item=>{
            console.log('Item key is'+Object.keys(item));
            console.log('Item value is'+Object.values(item));
            refinedData.push(Object.values(item));
        });
        console.log(Object.values(refinedData));
        let csvContent = ''

        refinedData.forEach(row => {
        csvContent += row.join(',') + '\n';
        
        });
        const blob = new Blob([csvContent], { content: 'text/csv' }); // Add BOM for Excel
        console.log(blob);
        
            const objUrl = window.URL.createObjectURL(blob);
            console.log('objUrl is'+objUrl);
    
            // Step 5: Create a download link and trigger click
            const link = document.createElement('a');
            link.href = objUrl;
            link.download = 'alignment_data.csv';
    
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            // Cleanup
            window.URL.revokeObjectURL(objUrl);
        
    

    }

    @wire(getProdRestriction ,{accnum:'$finalaccountnumber', team:'$finalteam'})wiredPRresult({error,data})
    {
        if(data)
        {
            this.Prresponse = data;
            this.error = undefined;
        }
        else if(error)
        {
            this.Prresponse = undefined;
            this.error = error;
        }
        console.log('Data returned:', JSON.stringify(data, null, 2));
        console.log('Response of wired result is'+this.Prresponse);
        console.log('Error ofwired result '+this.error);
    }

}