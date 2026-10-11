package com.studywise.service;

import com.studywise.dto.request.NoteRequest;
import com.studywise.dto.response.NoteResponse;
import com.studywise.entity.Note;
import com.studywise.entity.Subject;
import com.studywise.entity.User;
import com.studywise.exception.ResourceNotFoundException;
import com.studywise.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing student study notes with subject scoping and user isolation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NoteService {

    private final NoteRepository noteRepository;
    private final SubjectService subjectService;
    private final AuthService authService;

    /**
     * Retrieves all notes for the authenticated user.
     */
    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return noteRepository.findByUserIdOrderByUpdatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToNoteResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all notes for a specific subject.
     */
    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesBySubject(Long subjectId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        // Verify subject ownership
        subjectService.findSubjectAndVerifyOwnership(subjectId, currentUser.getId());

        return noteRepository.findByUserIdAndSubjectIdOrderByUpdatedAtDesc(currentUser.getId(), subjectId)
                .stream()
                .map(this::mapToNoteResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single note by ID.
     */
    @Transactional(readOnly = true)
    public NoteResponse getNoteById(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Note note = findNoteAndVerifyOwnership(id, currentUser.getId());
        return mapToNoteResponse(note);
    }

    /**
     * Creates a new note.
     */
    @Transactional
    public NoteResponse createNote(NoteRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Subject subject = subjectService.findSubjectAndVerifyOwnership(request.getSubjectId(), currentUser.getId());

        Note note = Note.builder()
                .title(request.getTitle().trim())
                .content(request.getContent())
                .subject(subject)
                .user(currentUser)
                .build();

        Note savedNote = noteRepository.save(note);
        log.info("Created note ID: {} for user ID: {}", savedNote.getId(), currentUser.getId());

        return mapToNoteResponse(savedNote);
    }

    /**
     * Updates an existing note.
     */
    @Transactional
    public NoteResponse updateNote(Long id, NoteRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Note note = findNoteAndVerifyOwnership(id, currentUser.getId());
        Subject subject = subjectService.findSubjectAndVerifyOwnership(request.getSubjectId(), currentUser.getId());

        note.setTitle(request.getTitle().trim());
        note.setContent(request.getContent());
        note.setSubject(subject);

        Note updatedNote = noteRepository.save(note);
        log.info("Updated note ID: {} for user ID: {}", updatedNote.getId(), currentUser.getId());

        return mapToNoteResponse(updatedNote);
    }

    /**
     * Deletes a note ensuring ownership.
     */
    @Transactional
    public void deleteNote(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Note note = findNoteAndVerifyOwnership(id, currentUser.getId());

        noteRepository.delete(note);
        log.info("Deleted note ID: {} for user ID: {}", id, currentUser.getId());
    }

    private Note findNoteAndVerifyOwnership(Long noteId, Long userId) {
        return noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", noteId));
    }

    private NoteResponse mapToNoteResponse(Note note) {
        return NoteResponse.builder()
                .id(note.getId())
                .subjectId(note.getSubject().getId())
                .subjectName(note.getSubject().getName())
                .subjectColor(note.getSubject().getColor())
                .title(note.getTitle())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .updatedAt(note.getUpdatedAt())
                .build();
    }
}
