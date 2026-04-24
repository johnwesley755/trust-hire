package com.trusthire.repository;

import com.trusthire.entity.SkillTestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SkillTestQuestionRepository extends JpaRepository<SkillTestQuestion, UUID> {
}
