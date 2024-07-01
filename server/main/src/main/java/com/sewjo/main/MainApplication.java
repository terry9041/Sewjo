package com.sewjo.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MainApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
		System.getProperty("DATABASE_URL");
		System.getProperty("DATABASE_USERNAME");
		System.getProperty("DATABASE_PASSWORD");
		SpringApplication.run(MainApplication.class, args);
	}

}
