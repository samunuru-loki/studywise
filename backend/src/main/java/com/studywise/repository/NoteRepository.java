package com.studywise.repository;

import com.studywise.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for Note entity.
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<Note> findByIdAndUserId(Long id, Long userId);

    List<Note> findByUserIdAndSubjectIdOrderByUpdatedAtDesc(Long userId, Long subjectId);

    long countByUserId(Long userId);

    long countBySubjectId(Long subjectId);
}
