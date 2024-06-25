-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2024 at 09:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `photos_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `name_collection` varchar(32) NOT NULL,
  `by_username` varchar(32) NOT NULL,
  `visibility` tinyint(1) NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tags` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `name_collection`, `by_username`, `visibility`, `images`, `tags`) VALUES
(1, 'main-gallery', '', 0, '[\"1\",\"2\",\"3\",\"13\"]', ''),
(2, 'g1', '10', 0, '[\"11\",\"12\"]', 'people#person'),
(3, 'g2', '10', 0, '', 'ddz'),
(5, 'toni', '10', 0, '', 'cute#fancy'),
(7, 'ddz', '10', 0, '', 'ddz');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `author` varchar(32) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_dir` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `size` int(11) NOT NULL,
  `type` varchar(64) NOT NULL,
  `last_modified` datetime NOT NULL,
  `make` varchar(64) DEFAULT NULL,
  `model` varchar(64) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `author`, `date_created`, `image_dir`, `name`, `size`, `type`, `last_modified`, `make`, `model`, `width`, `height`, `datetime`) VALUES
(7, '10', '2024-05-28 21:00:00', 'uploads/0bs1zdxbgx8nhs8kf01aeehmm0.jpg', '0bs1zdxbgx8nhs8kf01aeehmm0.jpg', 132399, 'image/jpeg', '2024-06-24 21:22:59', 'SONY', 'ILCE-7M2', 1200, 800, '2018-08-26 10:39:33'),
(8, '10', '2024-05-29 21:00:00', 'uploads/5xwvta28998baagq7dxnjkyvbs.jpg', '5xwvta28998baagq7dxnjkyvbs.jpg', 209405, 'image/jpeg', '2024-06-24 21:23:23', 'SONY', 'ILCE-7M2', 1200, 800, '2020-11-20 15:25:47'),
(9, '10', '2024-05-29 21:00:00', 'uploads/5xwvta28998baagq7dxnjkyvbs.jpg', '5xwvta28998baagq7dxnjkyvbs.jpg', 209405, 'image/jpeg', '2024-06-24 21:23:23', 'SONY', 'ILCE-7M2', 1200, 800, '2020-11-20 15:25:47'),
(10, '10', '2024-06-04 21:00:00', 'uploads/0bs1zdxbgx8nhs8kf01aeehmm0.jpg', '0bs1zdxbgx8nhs8kf01aeehmm0.jpg', 132399, 'image/jpeg', '2024-06-24 21:22:59', 'SONY', 'ILCE-7M2', 1200, 800, '2018-08-26 10:39:33'),
(11, '10', '2024-06-11 21:00:00', 'uploads/5xwvta28998baagq7dxnjkyvbs.jpg', '5xwvta28998baagq7dxnjkyvbs.jpg', 209405, 'image/jpeg', '2024-06-24 21:23:23', 'SONY', 'ILCE-7M2', 1200, 800, '2020-11-20 15:25:47'),
(12, '10', '2024-05-28 21:00:00', 'uploads/6frkfz60z29hfbz4tjydtm1ph4.jpg', '6frkfz60z29hfbz4tjydtm1ph4.jpg', 245534, 'image/jpeg', '2024-06-24 21:23:41', 'SONY', 'ILCE-7M2', 1200, 800, '2020-11-15 12:27:00'),
(13, '10', '2024-06-04 21:00:00', 'uploads/0bs1zdxbgx8nhs8kf01aeehmm0.jpg', '0bs1zdxbgx8nhs8kf01aeehmm0.jpg', 132399, 'image/jpeg', '2024-06-24 21:22:59', 'SONY', 'ILCE-7M2', 1200, 800, '2018-08-26 10:39:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(64) NOT NULL,
  `email` varchar(50) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `username`, `password`) VALUES
(1, 'Tanya Nikolaeva Ilieva', 't123@abv.bg', 'tanya', 'password'),
(3, 'Plamena Mladenova Ilieva', 'p123@abv.bg', 'plam1', 'parola'),
(4, 'Antoniya Georgieva Hristova', 'antonia1245@abv.bg', 'toni', '123456'),
(9, 'novoime', 'd123@abv.bg', 'edi', 'parola'),
(10, 'Иван Иванов', 'vanko123@abv.bg', 'vanko123', '5555');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;