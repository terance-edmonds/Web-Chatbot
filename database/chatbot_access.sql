-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2021 at 01:20 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatbot_access`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `role` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `email`, `role`) VALUES
(1, 'admin', '$2b$10$IHxPhfI1hGwkcoigdjjRrenSXeY5lZgFsZG9hubJtXDBdgik2EWlq', 'test@test.com', 'super_admin');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `token` varchar(200) NOT NULL,
  `credentials` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `token`, `credentials`) VALUES
(2, 'test@test1.com', 'localhost:8700', '{\n  \"name\": \"testbot\",\n  \"apiEndPoint\": \"us-central1-dialogflow.googleapis.com\",\n  \"agent_Id\": \"projects/chatbotproject-305806/locations/us-central1/agents/ae8907e6-b704-41b0-8465-93e931e03f89\",\n  \"type\": \"service_account\",\n  \"project_id\": \"chatbotproject-305806\",\n  \"private_key_id\": \"b5e17e45d08f18efec5951d0d7a478a61e3326c6\",\n  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDiA0ZWTt5ajwhd\\nAaY/af7CamZDn/CsWznXofTRVP8HBCqv+wZkgH0+9B76MQ4aUPrTY113cPwORjHt\\nYHMiYkSILBDtIGN8WBSf0SgIhktJdFM+MEnDun4A6zdHTjnDXRuRGOBM5lEekPL4\\nhSkPzQLXwonKcd+2G3OgeG6U5qYpX/Ps+ZNqD+ODO8WJj47NZRTmQJKdlAu+m1uS\\nZgtLPcWDxoR6mtHLMbOUug6Ieb8t7tw5Tr1uVXN8G0KtWHyAQ0Xeh4GW3tJ7Cqzp\\nZTTO1Yi6dHS2bDT65jIuNbOrydFK1Ci4NROYsstn+7ULPeSVVIXPgTQHRx1oL/P3\\noFOg6snJAgMBAAECggEAKtDKgBqwSlEK2U2w8BX1HmD4LwrrVcdxaX1jqs1Sg8KB\\nELX6A8uIjobCIIzu+kLJhYavI+uqQE0Bc9Hf9c1OZMqOSVGnrxxjidQeZKEGPavV\\nAjS1IKhhauykW/SAgldO29mt0juWdfcpJDXbrcPdbEDNCCYy5mWEbcuqzTf1leQd\\nmEU0z2BkngyLaW4Vj4Pmy0mwqKtjNbWb3huPlL7K0UJMteTbi7+wOpXaGCdojJPA\\nyCCVWdbEuwq/g/Xv/G5sBDOWVNf3+hFyHtxQv0Vy66XVJ5oASlGeE3AQW3sPCOeo\\nBQDQBSpli2lYLF01AvRBSpoX7Oj0B4mC+Ba2M5WWNQKBgQD5Wy5D/pkvq9ZgVKdP\\nKZcPgBSGggjYUqGQWm83TtMeQxIuBiFr0bJ2y9UjxIzWLviPRON4gC5T/vhq4QFi\\nGwO3ck65XYXhnySN/t6MQfTvaon/Tt8JZ2LoKJr8bOfjvXRDS+5tNWe+CBmcpJ70\\nsevSDhhFtGgUySJ/dc2hikZHfQKBgQDoCN9bLoHiO2NylEIoAey1EMvM4T7Wgcef\\nzzjihubdoEj93PgD9hmo25g+Z39CmX8DRwub+nctjjBqLdTmhM8Lo5wPhggMRGA6\\nMzpD1MJTNpGjQlb9H58Dv5uI1a6ZivKkysO4CKEuljFgb98NP2IekFpDucgxfr7i\\nGr2sRdCVPQKBgFiaTKM+eUIWJhOOoPChD5sjYKe21tu+6Me5SqF1cdDj9jbCWOfN\\n2EMcBH00HvMQN6P4z3cG3O9dvvmDQBGTFcv+Yvi8wZC9Eqkd8ggWe6kCy0wbw2a9\\nBMkHfKLLM86ZiBFNjsfhXR6KFEezuwOpoOi/t2I1S3JvUcHGoy2OS5ClAoGBAM0N\\najVuOCHxUcUj+ALbEJBCs5fvRlTSg9NakW6+wK8Cwv51lEgL6EktJrGfTPtSIsiG\\ntF+3TDLaATcUIZ1FqKMkhvnA/MO6eT91nfvrvX9ELhgUvEMc+q2ZWp3mGFJgVGYF\\nOkkcdzRwTlpnArr2VIOmFd7cA2qaE55E+3GOkPIRAoGAElSCUijJ9Z3h1H4c9sq9\\nsG8QKfZDdMMD93VS/ckhHXAqUayc0ddd0Vo6uRmU3TALXzh41BtOFkNrPuZxEU1/\\nBee88Ux+aQeZw8u7YTLpEW0kW/HQKUksSQVzn95mrCTh27sefs0MHPaHL/YF7zMe\\n3iQ71jnZeFd4jjSkhpTNcuI=\\n-----END PRIVATE KEY-----\\n\",\n  \"client_email\": \"chatbotproject@chatbotproject-305806.iam.gserviceaccount.com\",\n  \"client_id\": \"100112479490151503487\",\n  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\n  \"token_uri\": \"https://oauth2.googleapis.com/token\",\n  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\n  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/chatbotproject%40chatbotproject-305806.iam.gserviceaccount.com\"\n}\n'),
(3, 'test@test.com', 'localhost:7000', '{\n  \"name\": \"testbot\",\n  \"apiEndPoint\": \"us-central1-dialogflow.googleapis.com\",\n  \"agent_Id\": \"projects/chatbotproject-305806/locations/us-central1/agents/ae8907e6-b704-41b0-8465-93e931e03f89\",\n  \"type\": \"service_account\",\n  \"project_id\": \"chatbotproject-305806\",\n  \"private_key_id\": \"b5e17e45d08f18efec5951d0d7a478a61e3326c6\",\n  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDiA0ZWTt5ajwhd\\nAaY/af7CamZDn/CsWznXofTRVP8HBCqv+wZkgH0+9B76MQ4aUPrTY113cPwORjHt\\nYHMiYkSILBDtIGN8WBSf0SgIhktJdFM+MEnDun4A6zdHTjnDXRuRGOBM5lEekPL4\\nhSkPzQLXwonKcd+2G3OgeG6U5qYpX/Ps+ZNqD+ODO8WJj47NZRTmQJKdlAu+m1uS\\nZgtLPcWDxoR6mtHLMbOUug6Ieb8t7tw5Tr1uVXN8G0KtWHyAQ0Xeh4GW3tJ7Cqzp\\nZTTO1Yi6dHS2bDT65jIuNbOrydFK1Ci4NROYsstn+7ULPeSVVIXPgTQHRx1oL/P3\\noFOg6snJAgMBAAECggEAKtDKgBqwSlEK2U2w8BX1HmD4LwrrVcdxaX1jqs1Sg8KB\\nELX6A8uIjobCIIzu+kLJhYavI+uqQE0Bc9Hf9c1OZMqOSVGnrxxjidQeZKEGPavV\\nAjS1IKhhauykW/SAgldO29mt0juWdfcpJDXbrcPdbEDNCCYy5mWEbcuqzTf1leQd\\nmEU0z2BkngyLaW4Vj4Pmy0mwqKtjNbWb3huPlL7K0UJMteTbi7+wOpXaGCdojJPA\\nyCCVWdbEuwq/g/Xv/G5sBDOWVNf3+hFyHtxQv0Vy66XVJ5oASlGeE3AQW3sPCOeo\\nBQDQBSpli2lYLF01AvRBSpoX7Oj0B4mC+Ba2M5WWNQKBgQD5Wy5D/pkvq9ZgVKdP\\nKZcPgBSGggjYUqGQWm83TtMeQxIuBiFr0bJ2y9UjxIzWLviPRON4gC5T/vhq4QFi\\nGwO3ck65XYXhnySN/t6MQfTvaon/Tt8JZ2LoKJr8bOfjvXRDS+5tNWe+CBmcpJ70\\nsevSDhhFtGgUySJ/dc2hikZHfQKBgQDoCN9bLoHiO2NylEIoAey1EMvM4T7Wgcef\\nzzjihubdoEj93PgD9hmo25g+Z39CmX8DRwub+nctjjBqLdTmhM8Lo5wPhggMRGA6\\nMzpD1MJTNpGjQlb9H58Dv5uI1a6ZivKkysO4CKEuljFgb98NP2IekFpDucgxfr7i\\nGr2sRdCVPQKBgFiaTKM+eUIWJhOOoPChD5sjYKe21tu+6Me5SqF1cdDj9jbCWOfN\\n2EMcBH00HvMQN6P4z3cG3O9dvvmDQBGTFcv+Yvi8wZC9Eqkd8ggWe6kCy0wbw2a9\\nBMkHfKLLM86ZiBFNjsfhXR6KFEezuwOpoOi/t2I1S3JvUcHGoy2OS5ClAoGBAM0N\\najVuOCHxUcUj+ALbEJBCs5fvRlTSg9NakW6+wK8Cwv51lEgL6EktJrGfTPtSIsiG\\ntF+3TDLaATcUIZ1FqKMkhvnA/MO6eT91nfvrvX9ELhgUvEMc+q2ZWp3mGFJgVGYF\\nOkkcdzRwTlpnArr2VIOmFd7cA2qaE55E+3GOkPIRAoGAElSCUijJ9Z3h1H4c9sq9\\nsG8QKfZDdMMD93VS/ckhHXAqUayc0ddd0Vo6uRmU3TALXzh41BtOFkNrPuZxEU1/\\nBee88Ux+aQeZw8u7YTLpEW0kW/HQKUksSQVzn95mrCTh27sefs0MHPaHL/YF7zMe\\n3iQ71jnZeFd4jjSkhpTNcuI=\\n-----END PRIVATE KEY-----\\n\",\n  \"client_email\": \"chatbotproject@chatbotproject-305806.iam.gserviceaccount.com\",\n  \"client_id\": \"100112479490151503487\",\n  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\n  \"token_uri\": \"https://oauth2.googleapis.com/token\",\n  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\n  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/chatbotproject%40chatbotproject-305806.iam.gserviceaccount.com\"\n}\n');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
