import { LightningElement, track } from 'lwc';
import createIssue from '@salesforce/apex/IssueController.createIssue';

export default class IssueTracker extends LightningElement {
  @track name = '';
  @track description = '';
  @track status = '';
  @track priority = '';

  statusOptions = [
    { label: 'New', value: 'New' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Resolved', value: 'Resolved' }
  ];

  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ];

  handleNameChange(event) {
    this.name = event.detail.value;
  }

  handleDescriptionChange(event) {
    this.description = event.detail.value;
  }

  handleStatusChange(event) {
    this.status = event.detail.value;
  }

  handlePriorityChange(event) {
    this.priority = event.detail.value;
  }

  createIssue() {
    createIssue({
      name: this.name,
      description: this.description,
      status: this.status,
      priority: this.priority
    }).then(() => {
      alert('Issue created!');
      this.name = '';
      this.description = '';
      this.status = '';
      this.priority = '';
    }).catch(error => {
      console.error('Error creating issue:', error);
    });
  }
}