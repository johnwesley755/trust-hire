package com.trusthire.repository;

import com.trusthire.entity.SkillTestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillTestResultRepository extends JpaRepository<SkillTestResult, UUID> {
    List<SkillTestResult> findByWorkerId(String workerId);
    List<SkillTestResult> findByWorkerIdAndPassedTrue(String workerId);
}
