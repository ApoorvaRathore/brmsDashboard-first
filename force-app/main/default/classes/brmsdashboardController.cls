public with sharing class brmsdashboardController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String accNum) {
        if (String.isBlank(accNum)) { // Fix condition check
            return new List<Account>(); // Return an empty list instead of null
        }
        
        String key = '%' + accNum + '%';
        return [SELECT Id,Name, AccountNumber FROM Account WHERE AccountNumber  LIKE :key limit 10 ];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsNames(String accName) {
        if (String.isBlank(accName)) { // Fix condition check
            return new List<Account>(); // Return an empty list instead of null
        }
        
        String key = '%' + accName + '%';
        return [SELECT Id,Name, AccountNumber FROM Account WHERE Name LIKE :key limit 10 ];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<AxtriaSalesIQTM__Team_Instance__c> getTeamInstance() {

        return [select Id,Name from AxtriaSalesIQTM__Team_Instance__c where isSIT__c = True ];
    }
    
    @AuraEnabled(cacheable=true)
    public static List<AxtriaSalesIQTM__Position_Account__c> getAlignments(String accNum, String accName, String teamInstance) {
        System.debug('accNum is -- '+accNum);
        System.debug('accName is -- '+accName);
        System.debug('teamInstance is -- '+teamInstance);
        System.debug('limitvalue is -- '+limitvalue );
        System.debug('offsetvalue is -- '+offsetvalue);
        if (offsetvalue == null) 
            {
            offsetvalue = 0; // Default offset
            }
    
        String query = 'SELECT Id, Account__c , Account_Name__c,Account_Type__c,AxtriaSalesIQTM__Account_Alignment_Type__c,Position__c,AxtriaSalesIQTM__Assignment_Status__c, team_inst__c FROM AxtriaSalesIQTM__Position_Account__c WHERE Id != null';
        if (String.isNotBlank(accNum)) {
            query += ' AND Account__c LIKE :accNum';
        }
        if (String.isNotBlank(accName)) {
            query += ' AND Account_Name__c LIKE :accName';
        }
        if (String.isNotBlank(teamInstance)) {
            query += ' AND team_inst__c  LIKE :teamInstance';
        }
        query += ' order by Id,Account__c limit 10';
        System.debug('Query is ---- '+query);
        return Database.query(query);
    }
    
    @AuraEnabled(cacheable=true)
    public static List<AxtriaSalesIQTM__Position_Account__c> getAlignments(String accNum, String accName, String teamInstance,String lastId) {
        System.debug('accNum is -- '+accNum);
        System.debug('accName is -- '+accName);
        System.debug('teamInstance is -- '+teamInstance);
      
        String query = 'SELECT Id, Account__c , Account_Name__c,Account_Type__c,AxtriaSalesIQTM__Account_Alignment_Type__c,Position__c,AxtriaSalesIQTM__Assignment_Status__c, team_inst__c FROM AxtriaSalesIQTM__Position_Account__c WHERE Id != null';
        if (String.isNotBlank(accNum)) {
            query += ' AND Account__c LIKE :accNum';
        }
        if (String.isNotBlank(accName)) {
            query += ' AND Account_Name__c LIKE :accName';
        }
        if (String.isNotBlank(teamInstance)) {
            query += ' AND team_inst__c  LIKE :teamInstance';
        }
        query += ' order by Id,Account__c limit 10';
        System.debug('Query is ---- '+query);
        return Database.query(query);
    }

    @AuraEnabled
    public static Account getAccountDetails(String accNum)
    {
        return [SELECT Id,AccountNumber,AxtriaSalesIQTM__Active__c,FIPIT_Flag__c,Customer_Sub_Type__c from Account where AccountNumber= :accNum limit 1];
    }
    @AuraEnabled(cacheable=true)
    public static Account getProdRestriction(String accNum,String team)
    {
        return [SELECT Id,AccountNumber,AxtriaSalesIQTM__Active__c,FIPIT_Flag__c,Customer_Sub_Type__c from Account where AccountNumber= :accNum limit 1];
    }
    
}