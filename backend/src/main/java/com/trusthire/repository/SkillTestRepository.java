package com.trusthire.repository;

import com.trusthire.entity.SkillTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillTestRepository extends JpaRepository<SkillTest, UUID> {
    List<SkillTest> findByCategory(String category);
}
