package com.cfg.srh.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cfg.srh.entities.TicketStatusHistory;


@Repository
public interface TicketStatusHistoryRepository  extends JpaRepository<TicketStatusHistory,Integer>{

}
