{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_20
    yarn
    python3
    poetry
  ];

  shellHook = ''
    echo "Development environment loaded"
    echo "Node.js version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Python version: $(python3 --version)"
    echo "Poetry version: $(poetry --version)"
  '';
}
