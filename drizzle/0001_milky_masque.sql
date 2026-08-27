CREATE TABLE `artifact_citations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artifactId` int NOT NULL,
	`contextPackSourceId` int NOT NULL,
	`claimLabel` enum('observed','reported','inference','assumption','proposal') NOT NULL DEFAULT 'proposal',
	`citationNote` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `artifact_citations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `artifacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workItemId` int NOT NULL,
	`contextPackId` int NOT NULL,
	`title` varchar(240) NOT NULL,
	`artifactType` varchar(120) NOT NULL,
	`content` text NOT NULL,
	`sourceStatus` enum('authoritative_source','working_model','historical_context','new_proposal') NOT NULL DEFAULT 'new_proposal',
	`status` enum('draft','under_review','approved','rejected') NOT NULL DEFAULT 'draft',
	`generatedBy` varchar(160) NOT NULL,
	`syntheticOnly` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artifacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int,
	`eventType` varchar(160) NOT NULL,
	`entityType` varchar(120) NOT NULL,
	`entityId` int,
	`correlationId` varchar(100) NOT NULL,
	`activeContextLabel` varchar(500) NOT NULL,
	`details` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `context_pack_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contextPackId` int NOT NULL,
	`repositoryPath` varchar(512) NOT NULL,
	`sourceTitle` varchar(240) NOT NULL,
	`sourceStatus` enum('authoritative_source','working_model','historical_context') NOT NULL DEFAULT 'authoritative_source',
	`excerpt` text NOT NULL,
	`contentHash` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `context_pack_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `context_pack_sources_path_uq` UNIQUE(`contextPackId`,`repositoryPath`)
);
--> statement-breakpoint
CREATE TABLE `context_packs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`proposalSummary` text,
	`sourceStatus` enum('authoritative_source','working_model','historical_context','new_proposal') NOT NULL DEFAULT 'authoritative_source',
	`status` enum('draft','approved','superseded') NOT NULL DEFAULT 'draft',
	`assembledBy` varchar(160) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `context_packs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `decision_gates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`workItemId` int,
	`title` varchar(240) NOT NULL,
	`decisionQuestion` text NOT NULL,
	`owner` varchar(160) NOT NULL,
	`status` enum('pending','approved','rejected','deferred','revision_requested') NOT NULL DEFAULT 'pending',
	`dueAt` timestamp,
	`syntheticOnly` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `decision_gates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gateId` int NOT NULL,
	`decision` enum('approved','rejected','deferred','revision_requested') NOT NULL,
	`rationale` text NOT NULL,
	`decidedByUserId` int NOT NULL,
	`activeContextLabel` varchar(500) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int,
	`artifactId` int,
	`name` varchar(240) NOT NULL,
	`status` enum('pending','passed','failed') NOT NULL DEFAULT 'pending',
	`score` int,
	`criteria` text NOT NULL,
	`findings` text NOT NULL,
	`improvementCandidate` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evaluations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(240) NOT NULL,
	`hypothesis` text NOT NULL,
	`status` enum('planned','active','paused','complete') NOT NULL DEFAULT 'planned',
	`owner` varchar(160) NOT NULL,
	`successMetric` text NOT NULL,
	`pilotMode` enum('synthetic_only') NOT NULL DEFAULT 'synthetic_only',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experiments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `file_references` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int,
	`fileName` varchar(240) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`storageUrl` varchar(1024) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`sourceType` enum('source_document','evidence_file','generated_artifact') NOT NULL,
	`sourceStatus` enum('authoritative_source','working_model','historical_context','new_proposal') NOT NULL,
	`sensitivity` enum('internal','restricted','synthetic_demo') NOT NULL,
	`notes` text,
	`uploadedByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `file_references_id` PRIMARY KEY(`id`),
	CONSTRAINT `file_references_storage_key_uq` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE TABLE `legal_entities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(240) NOT NULL,
	`jurisdiction` varchar(120) NOT NULL,
	`syntheticOnly` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `legal_entities_id` PRIMARY KEY(`id`),
	CONSTRAINT `legal_entities_org_code_uq` UNIQUE(`organizationId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`legalEntityId` int NOT NULL,
	`stakeholderGroupId` int NOT NULL,
	`title` varchar(240) NOT NULL,
	`objective` text NOT NULL,
	`successMeasure` text NOT NULL,
	`owner` varchar(160) NOT NULL,
	`nextFounderAction` text NOT NULL,
	`status` enum('intake','active','review','blocked','complete') NOT NULL DEFAULT 'intake',
	`pilotMode` enum('synthetic_only') NOT NULL DEFAULT 'synthetic_only',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `missions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('decision_gate','failed_evaluation','missing_evidence','sla_risk','manual_review_exception') NOT NULL,
	`title` varchar(240) NOT NULL,
	`content` text NOT NULL,
	`owner` varchar(160) NOT NULL,
	`status` enum('queued','sent','failed','acknowledged') NOT NULL DEFAULT 'queued',
	`relatedRecordType` varchar(100) NOT NULL,
	`relatedRecordId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(240) NOT NULL,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`syntheticOnly` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `requirements_register` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`category` varchar(120) NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`status` enum('confirmed','working_assumption','open_decision','needs_evidence','deferred') NOT NULL,
	`priority` enum('P0','P1','P2') NOT NULL,
	`evidencePaths` json NOT NULL,
	`architectureDelta` text,
	`sourceStatus` enum('authoritative_source','working_model','historical_context','new_proposal') NOT NULL DEFAULT 'working_model',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `requirements_register_id` PRIMARY KEY(`id`),
	CONSTRAINT `requirements_register_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artifactId` int NOT NULL,
	`reviewerTeam` varchar(160) NOT NULL,
	`verdict` enum('pass','revision_needed','blocked') NOT NULL,
	`findings` text NOT NULL,
	`isIndependent` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `risks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int,
	`title` varchar(240) NOT NULL,
	`description` text NOT NULL,
	`severity` enum('low','moderate','high','critical') NOT NULL,
	`status` enum('open','monitoring','mitigated','accepted') NOT NULL DEFAULT 'open',
	`owner` varchar(160) NOT NULL,
	`mitigation` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `risks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stack_components` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`layer` varchar(120) NOT NULL,
	`status` enum('not_started','designing','testing','ready','blocked') NOT NULL DEFAULT 'not_started',
	`readinessScore` int NOT NULL DEFAULT 0,
	`owner` varchar(160) NOT NULL,
	`summary` text NOT NULL,
	`syntheticOnly` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stack_components_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stakeholder_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(240) NOT NULL,
	`description` text,
	`syntheticOnly` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stakeholder_groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `stakeholder_groups_org_code_uq` UNIQUE(`organizationId`,`code`)
);
--> statement-breakpoint
CREATE TABLE `user_contexts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`organizationId` int NOT NULL,
	`legalEntityId` int NOT NULL,
	`stakeholderGroupId` int NOT NULL,
	`humanRole` varchar(120) NOT NULL,
	`accessLevel` enum('viewer','operator','decision_owner','admin') NOT NULL DEFAULT 'viewer',
	`isDefault` boolean NOT NULL DEFAULT false,
	`syntheticOnly` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_contexts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `work_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`title` varchar(240) NOT NULL,
	`assignedTeam` varchar(160) NOT NULL,
	`objective` text NOT NULL,
	`artifactContract` text NOT NULL,
	`acceptanceCriteria` text NOT NULL,
	`status` enum('queued','in_progress','awaiting_review','blocked','complete') NOT NULL DEFAULT 'queued',
	`requiresIndependentReview` boolean NOT NULL DEFAULT true,
	`syntheticOnly` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `work_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `artifact_citations` ADD CONSTRAINT `artifact_citations_artifactId_artifacts_id_fk` FOREIGN KEY (`artifactId`) REFERENCES `artifacts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artifact_citations` ADD CONSTRAINT `artifact_citations_contextPackSourceId_context_pack_sources_id_fk` FOREIGN KEY (`contextPackSourceId`) REFERENCES `context_pack_sources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artifacts` ADD CONSTRAINT `artifacts_workItemId_work_items_id_fk` FOREIGN KEY (`workItemId`) REFERENCES `work_items`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artifacts` ADD CONSTRAINT `artifacts_contextPackId_context_packs_id_fk` FOREIGN KEY (`contextPackId`) REFERENCES `context_packs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_events` ADD CONSTRAINT `audit_events_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `context_pack_sources` ADD CONSTRAINT `context_pack_sources_contextPackId_context_packs_id_fk` FOREIGN KEY (`contextPackId`) REFERENCES `context_packs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `context_packs` ADD CONSTRAINT `context_packs_missionId_missions_id_fk` FOREIGN KEY (`missionId`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `decision_gates` ADD CONSTRAINT `decision_gates_missionId_missions_id_fk` FOREIGN KEY (`missionId`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `decision_gates` ADD CONSTRAINT `decision_gates_workItemId_work_items_id_fk` FOREIGN KEY (`workItemId`) REFERENCES `work_items`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `decisions` ADD CONSTRAINT `decisions_gateId_decision_gates_id_fk` FOREIGN KEY (`gateId`) REFERENCES `decision_gates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `decisions` ADD CONSTRAINT `decisions_decidedByUserId_users_id_fk` FOREIGN KEY (`decidedByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_missionId_missions_id_fk` FOREIGN KEY (`missionId`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_artifactId_artifacts_id_fk` FOREIGN KEY (`artifactId`) REFERENCES `artifacts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_references` ADD CONSTRAINT `file_references_missionId_missions_id_fk` FOREIGN KEY (`missionId`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `file_references` ADD CONSTRAINT `file_references_uploadedByUserId_users_id_fk` FOREIGN KEY (`uploadedByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `legal_entities` ADD CONSTRAINT `legal_entities_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `missions` ADD CONSTRAINT `missions_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `missions` ADD CONSTRAINT `missions_legalEntityId_legal_entities_id_fk` FOREIGN KEY (`legalEntityId`) REFERENCES `legal_entities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `missions` ADD CONSTRAINT `missions_stakeholderGroupId_stakeholder_groups_id_fk` FOREIGN KEY (`stakeholderGroupId`) REFERENCES `stakeholder_groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_artifactId_artifacts_id_fk` FOREIGN KEY (`artifactId`) REFERENCES `artifacts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `risks` ADD CONSTRAINT `risks_missionId_missions_id_fk` FOREIGN KEY (`missionId`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stakeholder_groups` ADD CONSTRAINT `stakeholder_groups_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_contexts` ADD CONSTRAINT `user_contexts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_contexts` ADD CONSTRAINT `user_contexts_organizationId_organizations_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_contexts` ADD CONSTRAINT `user_contexts_legalEntityId_legal_entities_id_fk` FOREIGN KEY (`legalEntityId`) REFERENCES `legal_entities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_contexts` ADD CONSTRAINT `user_contexts_stakeholderGroupId_stakeholder_groups_id_fk` FOREIGN KEY (`stakeholderGroupId`) REFERENCES `stakeholder_groups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `work_items` ADD CONSTRAINT `work_items_missionId_missions_id_fk` FOREIGN KEY (`missionId`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `artifact_citations_artifact_idx` ON `artifact_citations` (`artifactId`);--> statement-breakpoint
CREATE INDEX `artifacts_work_item_idx` ON `artifacts` (`workItemId`,`status`);--> statement-breakpoint
CREATE INDEX `artifacts_context_pack_idx` ON `artifacts` (`contextPackId`);--> statement-breakpoint
CREATE INDEX `audit_events_correlation_idx` ON `audit_events` (`correlationId`);--> statement-breakpoint
CREATE INDEX `audit_events_entity_idx` ON `audit_events` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `context_pack_sources_pack_idx` ON `context_pack_sources` (`contextPackId`);--> statement-breakpoint
CREATE INDEX `context_packs_mission_idx` ON `context_packs` (`missionId`,`status`);--> statement-breakpoint
CREATE INDEX `decision_gates_mission_idx` ON `decision_gates` (`missionId`,`status`);--> statement-breakpoint
CREATE INDEX `decision_gates_status_idx` ON `decision_gates` (`status`,`dueAt`);--> statement-breakpoint
CREATE INDEX `decisions_gate_idx` ON `decisions` (`gateId`);--> statement-breakpoint
CREATE INDEX `evaluations_status_idx` ON `evaluations` (`status`);--> statement-breakpoint
CREATE INDEX `evaluations_mission_idx` ON `evaluations` (`missionId`);--> statement-breakpoint
CREATE INDEX `experiments_status_idx` ON `experiments` (`status`);--> statement-breakpoint
CREATE INDEX `file_references_mission_idx` ON `file_references` (`missionId`);--> statement-breakpoint
CREATE INDEX `legal_entities_org_idx` ON `legal_entities` (`organizationId`);--> statement-breakpoint
CREATE INDEX `missions_scope_idx` ON `missions` (`organizationId`,`legalEntityId`,`stakeholderGroupId`);--> statement-breakpoint
CREATE INDEX `missions_status_idx` ON `missions` (`status`);--> statement-breakpoint
CREATE INDEX `notifications_status_idx` ON `notifications` (`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `requirements_priority_idx` ON `requirements_register` (`priority`,`status`);--> statement-breakpoint
CREATE INDEX `reviews_artifact_idx` ON `reviews` (`artifactId`,`verdict`);--> statement-breakpoint
CREATE INDEX `risks_status_severity_idx` ON `risks` (`status`,`severity`);--> statement-breakpoint
CREATE INDEX `risks_mission_idx` ON `risks` (`missionId`);--> statement-breakpoint
CREATE INDEX `stack_components_status_idx` ON `stack_components` (`status`);--> statement-breakpoint
CREATE INDEX `stakeholder_groups_org_idx` ON `stakeholder_groups` (`organizationId`);--> statement-breakpoint
CREATE INDEX `user_contexts_user_idx` ON `user_contexts` (`userId`);--> statement-breakpoint
CREATE INDEX `user_contexts_scope_idx` ON `user_contexts` (`organizationId`,`legalEntityId`,`stakeholderGroupId`);--> statement-breakpoint
CREATE INDEX `work_items_mission_idx` ON `work_items` (`missionId`,`status`);