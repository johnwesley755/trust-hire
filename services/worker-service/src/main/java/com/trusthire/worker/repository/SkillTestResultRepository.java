package com.trusthire.worker.repository;

import com.trusthire.worker.entity.SkillTestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SkillTestResultRepository extends JpaRepository<SkillTestResult, UUID> {
    List<SkillTestResult> findByWorkerId(String workerId);
    List<SkillTestResult> findByWorkerIdAndPassedTrue(String workerId);
}
