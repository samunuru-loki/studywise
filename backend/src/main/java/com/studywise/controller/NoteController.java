package com.studywise.controller;

import com.studywise.dto.request.NoteRequest;
import com.studywise.dto.response.ApiResponse;
import com.studywise.dto.response.NoteResponse;
import com.studywise.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller exposing RESTful CRUD endpoints for study notes.
 */
@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    /**
     * Retrieves all notes or filters by subject ID.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteResponse>>> getAllNotes(
            @RequestParam(required = false) Long subjectId) {
        List<NoteResponse> notes = (subjectId != null) 
                ? noteService.getNotesBySubject(subjectId)
                : noteService.getAllNotes();
        return ResponseEntity.ok(ApiResponse.ok("Notes retrieved successfully", notes));
    }

    /**
     * Retrieves a single note by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> getNoteById(@PathVariable Long id) {
        NoteResponse note = noteService.getNoteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Note retrieved successfully", note));
    }

    /**
     * Creates a new note.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<NoteResponse>> createNote(@Valid @RequestBody NoteRequest request) {
        NoteResponse createdNote = noteService.createNote(request);
        return new ResponseEntity<>(
                ApiResponse.ok("Note created successfully", createdNote),
                HttpStatus.CREATED
        );
    }

    /**
     * Updates an existing note by ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteResponse>> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequest request) {
        NoteResponse updatedNote = noteService.updateNote(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Note updated successfully", updatedNote));
    }

    /**
     * Deletes a note by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok(ApiResponse.ok("Note deleted successfully", null));
    }
}
