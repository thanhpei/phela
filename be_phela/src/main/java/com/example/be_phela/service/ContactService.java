package com.example.be_phela.service;

import com.example.be_phela.interService.IContactService;
import com.example.be_phela.model.Contact;
import com.example.be_phela.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactService implements IContactService {
    @Autowired
    private ContactRepository contactRepository;

    @Override
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }
}
