package com.involveininnovation.chat.repository;

import com.involveininnovation.chat.model.CopiedMessage;
import com.involveininnovation.chat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CopiedMessageRepository extends JpaRepository<CopiedMessage, Long> {

    List<CopiedMessage> findByUser(User user);

}
