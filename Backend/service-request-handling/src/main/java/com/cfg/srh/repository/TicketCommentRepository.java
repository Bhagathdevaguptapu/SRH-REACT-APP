package com.cfg.srh.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cfg.srh.entities.TicketComment;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Integer>{

}