package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
