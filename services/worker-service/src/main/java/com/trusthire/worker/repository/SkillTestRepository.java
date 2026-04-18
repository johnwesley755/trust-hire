package com.trusthire.worker.repository;

import com.trusthire.worker.entity.SkillTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SkillTestRepository extends JpaRepository<SkillTest, UUID> {
}
