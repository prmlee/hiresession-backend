-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 11, 2020 at 06:28 PM
-- Server version: 5.7.30-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hiresession`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admins`
--

CREATE TABLE `Admins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('general','support') DEFAULT 'general',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Admins`
--

INSERT INTO `Admins` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'General Admin', 'admin@hiresession.com', '$2b$10$lo4z/wY4AS9G.C03klqObu9JNjzxlA5jhWE85A1EYNhOjH4IuYpzi', 'general', '2020-05-02 15:51:48', '2020-05-02 15:51:48');

-- --------------------------------------------------------

--
-- Table structure for table `AttachedEmployees`
--

CREATE TABLE `AttachedEmployees` (
  `id` bigint(19) NOT NULL,
  `userId` int(11) NOT NULL,
  `EventId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `AttachedEmployees`
--

INSERT INTO `AttachedEmployees` (`id`, `userId`, `EventId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(5, 4, 1, '2020-06-11 01:09:59', '2020-06-11 01:09:59', NULL),
(6, 22, 1, '2020-06-11 01:09:59', '2020-06-11 01:09:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Candidates`
--

CREATE TABLE `Candidates` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `shcool` varchar(255) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `highDeagree` varchar(255) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `graduationYear` int(11) DEFAULT NULL,
  `desiredJobTitle` varchar(255) DEFAULT NULL,
  `industryInterested` varchar(255) DEFAULT NULL,
  `zipCode` varchar(255) DEFAULT NULL,
  `specialNeeds` text,
  `profileImg` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Candidates`
--

INSERT INTO `Candidates` (`id`, `userId`, `shcool`, `major`, `highDeagree`, `resume`, `graduationYear`, `desiredJobTitle`, `industryInterested`, `zipCode`, `specialNeeds`, `profileImg`, `phone`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(2, 6, 'The Ohio State University', 'Counseling/Higher Ed Administration', 'Master (MA, MS)', '', 1984, 'President', 'Education', '43054', '', 'profileImg-1591800042853.JPG', '614-946-4508', '2020-06-10 14:40:46', '2020-06-10 14:40:46', NULL),
(3, 10, 'The Ohio State University', '', 'Master (MA, MS)', '', 0, '', 'Education', '43210', '', 'profileImg-1591801358905.jpg', '6142923314', '2020-06-10 15:02:40', '2020-06-10 15:02:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Employees`
--

CREATE TABLE `Employees` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `eventId` int(11) DEFAULT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `JobTitle` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `profileImg` varchar(255) DEFAULT NULL,
  `companyImg` varchar(255) DEFAULT NULL,
  `videoUrl` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Employees`
--

INSERT INTO `Employees` (`id`, `userId`, `eventId`, `companyName`, `JobTitle`, `phone`, `profileImg`, `companyImg`, `videoUrl`, `city`, `state`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(4, 4, NULL, 'Hire Talent', 'President', '917-232-0138', 'profileImg-1591728589596.jpg', 'companyLogo-1591728589595.jpg', 'https://www.youtube.com/user/TDBankUS', 'Huntington', 'NY', '2020-06-09 18:49:50', '2020-06-09 18:49:50', NULL),
(17, 27, NULL, 'HireSessions', 'President', '917-232-0138', 'profileImg-1591898010308.png', 'companyLogo-1591898010306.png', 'https://www.youtube.com/user/TDBankUS', 'New York', 'NY', '2020-06-11 17:53:31', '2020-06-11 17:53:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employeeSettings`
--

CREATE TABLE `employeeSettings` (
  `id` int(11) NOT NULL,
  `employeeId` int(11) DEFAULT NULL,
  `eventId` int(11) NOT NULL,
  `date` varchar(255) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `durationType` enum('Min','Hours') DEFAULT 'Min',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `employeeSettings`
--

INSERT INTO `employeeSettings` (`id`, `employeeId`, `eventId`, `date`, `duration`, `durationType`, `createdAt`, `updatedAt`) VALUES
(1, 4, 1, '2020-06-24', 6, 'Min', '2020-06-09 18:55:37', '2020-06-09 18:55:37');

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `eventName` varchar(255) DEFAULT NULL,
  `eventLogo` varchar(255) DEFAULT NULL,
  `pdfFile` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `bizaboLink` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Events`
--

INSERT INTO `Events` (`id`, `userId`, `eventName`, `eventLogo`, `pdfFile`, `date`, `startTime`, `endTime`, `bizaboLink`, `location`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, NULL, 'HireSouthCarolina Virtual Alumni Career Fair', 'eventLogo-1591713326618.png', 'pdfFile-1591837799736.pdf', '2020-06-24', '10:00:00', '16:00:00', 'https://events.bizzabo.com/hirevirtualsc2020?promo=hs&tr=true', 'SC', '2020-06-09 14:14:28', '2020-06-11 01:09:59', NULL),
(2, NULL, 'HireUC Virtual Alumni Career Fair', 'eventLogo-1591713358502.png', '', '2020-07-15', '10:00:00', '16:00:00', 'https://events.bizzabo.com/hireucvirtual?promo=hs&tr=true', 'CA', '2020-06-09 14:20:36', '2020-06-09 14:35:58', NULL),
(3, NULL, 'HireNewYork-Metro Virtual Alumni Career Fair', 'eventLogo-1591713385316.png', '', '2020-07-22', '10:00:00', '16:00:00', 'https://events.bizzabo.com/hirenymetroVirtual?promo=hs&tr=true', 'NY', '2020-06-09 14:29:52', '2020-06-09 14:36:25', NULL),
(4, NULL, 'HireOhio Virtual Alumni Career Fair', 'eventLogo-1591713603437.png', '', '2020-07-23', '10:00:00', '16:00:00', 'https://events.bizzabo.com/virtualhireohio?promo=hs&tr=true', 'OH', '2020-06-09 14:40:03', '2020-06-09 14:40:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Favorits`
--

CREATE TABLE `Favorits` (
  `id` int(11) NOT NULL,
  `candidateId` int(11) DEFAULT NULL,
  `employeeId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Interviews`
--

CREATE TABLE `Interviews` (
  `id` int(11) NOT NULL,
  `employeeId` int(11) DEFAULT NULL,
  `candidateId` int(11) DEFAULT NULL,
  `eventId` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `note` text,
  `employeeNote` text NOT NULL,
  `startUrl` text NOT NULL,
  `meetingId` varchar(255) NOT NULL,
  `joinUrl` varchar(255) NOT NULL,
  `status` enum('interviewed','canceled','upcoming') DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `attachedFile` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('2018061510000-create-user.js'),
('2018061510000-create-zoom-user.js'),
('2018061510001-create-event.js'),
('20180615130024-create-attached-employee.js'),
('20180615130024-create-candidate.js'),
('20180615130024-create-employee.js'),
('20180615130024-create-supporting-document.js'),
('20180615130024-favorit.js'),
('20180828114414-create-employeer-settings.js'),
('20180828114414-create-interview.js'),
('20180828114414-create-setting-duration.js'),
('20180828114415-create-admin.js');

-- --------------------------------------------------------

--
-- Table structure for table `SettingDurations`
--

CREATE TABLE `SettingDurations` (
  `id` int(11) NOT NULL,
  `settingId` int(11) DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `SettingDurations`
--

INSERT INTO `SettingDurations` (`id`, `settingId`, `startTime`, `endTime`, `createdAt`, `updatedAt`) VALUES
(1, 1, '10:00:00', '16:00:00', '2020-06-09 18:55:37', '2020-06-09 18:55:37');

-- --------------------------------------------------------

--
-- Table structure for table `SupportingDocuments`
--

CREATE TABLE `SupportingDocuments` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `docName` varchar(255) DEFAULT NULL,
  `fileSize` varchar(200) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `SupportingDocuments`
--

INSERT INTO `SupportingDocuments` (`id`, `userId`, `docName`, `fileSize`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(4, 4, 'supportingDocs-1591728589614.jpg', '106430', '2020-06-09 18:49:50', '2020-06-09 18:49:50', NULL),
(10, 27, 'supportingDocs-1591898010368.jpg', '106430', '2020-06-11 17:53:31', '2020-06-11 17:53:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `role` enum('candidate','employer') DEFAULT 'candidate',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `firstName`, `email`, `lastName`, `password`, `status`, `role`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(4, 'Jeffrey', 'jeff@gohiretalent.com', 'Nortman', '$2b$10$.mzrb3PxI.obZSLY7jIZPeyU525mby2wedR2G8sC5tr22xblW03j6', 'active', 'employer', '2020-06-09 18:49:49', '2020-06-09 18:51:25', NULL),
(6, 'Marilyn', 'rice.344@osu.edu', 'Rice', '$2b$10$gY.K2MfeKzNOPZWSVSvX7.mEcZJT0NkYiYUq7.OOQilyNqoJKLBYS', 'active', 'candidate', '2020-06-10 14:40:44', '2020-06-10 17:15:37', NULL),
(10, 'Ankit', 'shah.1349@osu.edu', 'Shah', '$2b$10$8E7yjqgArWuz3dL6.1YogubBzRbyUACL/G09tVLeVncWKPT6uUiX6', 'active', 'candidate', '2020-06-10 15:02:38', '2020-06-10 17:02:22', NULL),
(27, 'Jeff', 'jeff@hiresessions.com', 'Nortman', '$2b$10$qIEhcRFchXEC1MwY/CMAw.Z1EIQfwvEMFZpvTr9EYyPwEeHe.2Q62', 'inactive', 'employer', '2020-06-11 17:53:30', '2020-06-11 17:53:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ZoomUsers`
--

CREATE TABLE `ZoomUsers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ZoomUsers`
--

INSERT INTO `ZoomUsers` (`id`, `email`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'jeff@gohiretalent.com', '2020-06-09 19:03:03', '2020-06-09 19:03:03', NULL),
(2, 'Tester@nortman.com', '2020-06-11 01:18:31', '2020-06-11 01:18:31', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admins`
--
ALTER TABLE `Admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `AttachedEmployees`
--
ALTER TABLE `AttachedEmployees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Candidates`
--
ALTER TABLE `Candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `Employees`
--
ALTER TABLE `Employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `eventId` (`eventId`);

--
-- Indexes for table `employeeSettings`
--
ALTER TABLE `employeeSettings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeId` (`employeeId`);

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `Favorits`
--
ALTER TABLE `Favorits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `candidateId` (`candidateId`),
  ADD KEY `employeeId` (`employeeId`);

--
-- Indexes for table `Interviews`
--
ALTER TABLE `Interviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employeeId` (`employeeId`),
  ADD KEY `candidateId` (`candidateId`),
  ADD KEY `eventId` (`eventId`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `SettingDurations`
--
ALTER TABLE `SettingDurations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `settingId` (`settingId`);

--
-- Indexes for table `SupportingDocuments`
--
ALTER TABLE `SupportingDocuments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `ZoomUsers`
--
ALTER TABLE `ZoomUsers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Admins`
--
ALTER TABLE `Admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `AttachedEmployees`
--
ALTER TABLE `AttachedEmployees`
  MODIFY `id` bigint(19) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `Candidates`
--
ALTER TABLE `Candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `Employees`
--
ALTER TABLE `Employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `employeeSettings`
--
ALTER TABLE `employeeSettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `Favorits`
--
ALTER TABLE `Favorits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `Interviews`
--
ALTER TABLE `Interviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `SettingDurations`
--
ALTER TABLE `SettingDurations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `SupportingDocuments`
--
ALTER TABLE `SupportingDocuments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `ZoomUsers`
--
ALTER TABLE `ZoomUsers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Candidates`
--
ALTER TABLE `Candidates`
  ADD CONSTRAINT `Candidates_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Employees`
--
ALTER TABLE `Employees`
  ADD CONSTRAINT `Employees_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Employees_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `Events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employeeSettings`
--
ALTER TABLE `employeeSettings`
  ADD CONSTRAINT `employeeSettings_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Events`
--
ALTER TABLE `Events`
  ADD CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Favorits`
--
ALTER TABLE `Favorits`
  ADD CONSTRAINT `Favorits_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Favorits_ibfk_2` FOREIGN KEY (`employeeId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Interviews`
--
ALTER TABLE `Interviews`
  ADD CONSTRAINT `Interviews_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Interviews_ibfk_2` FOREIGN KEY (`candidateId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Interviews_ibfk_3` FOREIGN KEY (`eventId`) REFERENCES `Events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `SettingDurations`
--
ALTER TABLE `SettingDurations`
  ADD CONSTRAINT `SettingDurations_ibfk_1` FOREIGN KEY (`settingId`) REFERENCES `employeeSettings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `SupportingDocuments`
--
ALTER TABLE `SupportingDocuments`
  ADD CONSTRAINT `SupportingDocuments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
