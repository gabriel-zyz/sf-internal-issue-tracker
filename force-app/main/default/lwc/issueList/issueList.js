import { LightningElement, wire, track } from 'lwc';
import getIssues from '@salesforce/apex/IssueController.getIssues';
import deleteIssue from '@salesforce/apex/IssueController.deleteIssue';
import updateIssue from '@salesforce/apex/IssueController.updateIssue';
import { refreshApex } from '@salesforce/apex';

export default class IssueList extends LightningElement {
    @track statusFilter = '';
    @track priorityFilter = '';
    @track isModalOpen = false;
    @track selectedIssue = {};
    @track filteredData = [];

    issues;
    wiredIssuesResult;

    statusOptions = [
        { label: 'All', value: '' },
        { label: 'New', value: 'New' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Resolved', value: 'Resolved' }
    ];

    priorityOptions = [
        { label: 'All', value: '' },
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' }
    ];

    @wire(getIssues)
    wiredIssues(result) {
        this.wiredIssuesResult = result;
        if (result.data) {
            this.issues = result.data;
            this.applyFilters(); 
        }
    }

    get filteredIssues() {
        return this.filteredData;
    }

    applyFilters() {
        if (!this.issues) return;

        this.filteredData = this.issues.filter(issue => {
            const matchesStatus = this.statusFilter === '' || issue.Status__c === this.statusFilter;
            const matchesPriority = this.priorityFilter === '' || issue.Priority__c === this.priorityFilter;
            return matchesStatus && matchesPriority;
        });
    }

    handleStatusFilterChange(event) {
        this.statusFilter = event.detail.value;
        this.applyFilters();
    }

    handlePriorityFilterChange(event) {
        this.priorityFilter = event.detail.value;
        this.applyFilters();
    }

    handleDelete(event) {
        const issueId = event.target.dataset.id;
        const isConfirmed = confirm('Are you sure you want to delete this issue?');
        if (!isConfirmed) return;

        deleteIssue({ issueId })
            .then(() => refreshApex(this.wiredIssuesResult))
            .catch(error => console.error('Error deleting issue:', error));
    }

    handleEdit(event) {
        const issueId = event.target.dataset.id;
        const issue = this.issues.find(i => i.Id === issueId);
        this.selectedIssue = { ...issue };
        this.isModalOpen = true;
    }

    handleFieldChange(event) {
        const field = event.target.dataset.field;
        this.selectedIssue = {
            ...this.selectedIssue,
            [field]: event.target.value
        };
    }

    closeModal() {
        this.isModalOpen = false;
    }

    async handleSave() {
        try {
            await updateIssue({ updatedIssue: this.selectedIssue });
            this.isModalOpen = false;
            return refreshApex(this.wiredIssuesResult);
        } catch (error) {
            console.error('Error updating issue', error);
        }
    }
}