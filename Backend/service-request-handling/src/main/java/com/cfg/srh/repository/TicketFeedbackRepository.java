package com.cfg.srh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cfg.srh.entities.TicketFeedback;

public interface TicketFeedbackRepository extends JpaRepository<TicketFeedback, Integer> {
	
	 @Query("SELECT tf FROM TicketFeedback tf JOIN FETCH tf.ticket t JOIN FETCH tf.employee e")
	    List<TicketFeedback> findAllWithRelations();
}
