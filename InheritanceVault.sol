// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract InheritanceVault {
    struct Vault {
        uint256 balance;
        address heir;
        uint256 lastCheckIn;
        uint256 inactivityLimit;
        bool isActive;
    }

    mapping(address => Vault) public vaults;

    event Deposited(address indexed owner, uint256 amount);
    event CheckedIn(address indexed owner, uint256 timestamp);
    event Inherited(
        address indexed owner,
        address indexed heir,
        uint256 amount
    );

    // Setup awal untuk vault user
    function setupVault(
        address _heir,
        uint256 _inactivityLimitInDays
    ) external {
        vaults[msg.sender].heir = _heir;
        vaults[msg.sender].inactivityLimit = _inactivityLimitInDays * 1 days;
        vaults[msg.sender].lastCheckIn = block.timestamp;
        vaults[msg.sender].isActive = true;
    }

    // Fungsi untuk menerima ETH (dari Payment Gateway Bridge)
    function deposit() external payable {
        require(vaults[msg.sender].isActive, "Vault not setup");
        vaults[msg.sender].balance += msg.value;
        vaults[msg.sender].lastCheckIn = block.timestamp; // Auto check-in saat menabung
        emit Deposited(msg.sender, msg.value);
    }

    // Proof of Life (Ping)
    function checkIn() external {
        require(vaults[msg.sender].isActive, "Vault not setup");
        vaults[msg.sender].lastCheckIn = block.timestamp;
        emit CheckedIn(msg.sender, block.timestamp);
    }

    // Fungsi klaim oleh ahli waris
    function claimInheritance(address _owner) external {
        Vault storage vault = vaults[_owner];

        // 1. Checks (Pengecekan)
        require(vault.isActive, "Vault does not exist");
        require(msg.sender == vault.heir, "You are not the heir");
        require(
            block.timestamp > vault.lastCheckIn + vault.inactivityLimit,
            "Owner is still considered active"
        );

        uint256 amount = vault.balance;
        require(amount > 0, "No ETH to claim");

        // 2. Effects (Perubahan State dilakukan SEBELUM pengiriman uang)
        vault.balance = 0;
        vault.isActive = false;

        // 3. Interactions (Pengiriman uang menggunakan .call)
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Inherited(_owner, msg.sender, amount);
    }

    // Melihat saldo vault
    function getVaultDetails(
        address _owner
    ) external view returns (Vault memory) {
        return vaults[_owner];
    }

    receive() external payable {
        // Fallback untuk menerima kiriman ETH langsung
    }
}
