public with sharing class IssueController {
    @AuraEnabled
    public static void createIssue(String name, String description, String status, String priority) {
        Issue__c newIssue = new Issue__c(
            Name = name,
            Description__c = description,
            Status__c = status,
            Priority__c = priority
        );
        insert newIssue;
    }

    @AuraEnabled(cacheable=true)
    public static List<Issue__c> getIssues() {
        return [SELECT Id, Name, Title__c, Description__c, Status__c, Priority__c FROM Issue__c ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static void deleteIssue(Id issueId) {
        delete [SELECT Id FROM Issue__c WHERE Id = :issueId LIMIT 1];
    }

    @AuraEnabled
    public static void updateIssue(Issue__c updatedIssue) {
        update updatedIssue;
    }
}