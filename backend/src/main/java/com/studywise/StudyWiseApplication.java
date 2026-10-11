package com.studywise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the StudyWise Backend Application.
 * 
 * Provides REST APIs for student authentication, subject management,
 * study planning, task tracking, notes management, and progress dashboard analytics.
 */
@SpringBootApplication
public class StudyWiseApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudyWiseApplication.class, args);
    }
}
