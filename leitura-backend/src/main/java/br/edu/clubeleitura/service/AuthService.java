package br.edu.clubeleitura.service;

import br.edu.clubeleitura.dto.request.LoginRequestDTO;
import br.edu.clubeleitura.dto.request.UsuarioRequestDTO;
import br.edu.clubeleitura.dto.response.TokenResponseDTO;
import br.edu.clubeleitura.dto.response.UsuarioResponseDTO;
import br.edu.clubeleitura.exception.EmailJaCadastradoException;
import br.edu.clubeleitura.model.Estatistica;
import br.edu.clubeleitura.model.Usuario;
import br.edu.clubeleitura.repository.UsuarioRepository;
import br.edu.clubeleitura.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public UsuarioResponseDTO cadastrar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new EmailJaCadastradoException("Email já cadastrado: " + dto.getEmail());
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .fotoPerfil(dto.getFotoPerfil())
                .tipoPerfil(dto.getTipoPerfil() != null ? dto.getTipoPerfil() : "leitor")
                .build();

        Estatistica estatistica = Estatistica.builder()
                .usuario(usuario)
                .build();
        usuario.setEstatistica(estatistica);

        usuario = usuarioRepository.save(usuario);

        return toResponseDTO(usuario);
    }

    public TokenResponseDTO login(LoginRequestDTO dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha()));

        String token = jwtTokenProvider.gerarToken(authentication);
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return TokenResponseDTO.builder()
                .token(token)
                .tipo("Bearer")
                .email(usuario.getEmail())
                .nome(usuario.getNome())
                .id(usuario.getId())
                .fotoPerfil(usuario.getFotoPerfil())
                .build();
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .fotoPerfil(usuario.getFotoPerfil())
                .tipoPerfil(usuario.getTipoPerfil())
                .dataCadastro(usuario.getDataCadastro())
                .build();
    }
}
