import { Client, Account } from 'appwrite';

export const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('678a5358002d617c1a4c');

export const account = new Account(client);
