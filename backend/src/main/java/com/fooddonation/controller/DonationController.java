package com.fooddonation.controller;

import com.fooddonation.dto.AuthRequest;
import com.fooddonation.dto.AuthResponse;
import com.fooddonation.dto.SignupRequest;
import com.fooddonation.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerpackage com.fooddonation.controller;

import com.fooddonation.dto.DonationRequest;
import com.fooddonation.entity.Donation;
import com.fooddonation.service.DonationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<Donation> createDonation(@RequestBody DonationRequest request, Authentication authentication) {
        return ResponseEntity.ok(donationService.createDonation(request, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Donation>> getMyDonations(Authentication authentication) {
        return ResponseEntity.ok(donationService.getMyDonations(authentication.getName()));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Donation>> getNearbyDonations(@RequestParam Double lat, @RequestParam Double lng, @RequestParam Double radius) {
        return ResponseEntity.ok(donationService.getNearbyDonations(lat, lng, radius));
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<Donation> claimDonation(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(donationService.claimDonation(id, authentication.getName()));
    }

    @PostMapping("/{id}/pickup")
    public ResponseEntity<Donation> pickupDonation(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        String otp = body.get("otp");
        return ResponseEntity.ok(donationService.pickupDonation(id, otp, authentication.getName()));
    }

    @PostMapping("/{id}/deliver")
    public ResponseEntity<Donation> deliverDonation(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(donationService.deliverDonation(id, authentication.getName()));
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Donation>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }
}

@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Allows all origins, restrict in production
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
