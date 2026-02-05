const CONTRACT_ADDRESS = "0x58d5240E388f95651927D896200583fe0bDD46d1";
const CONTRACT_ABI = [ [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CheckedIn",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "checkIn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "claimInheritance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "heir",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Inherited",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_heir",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_inactivityLimitInDays",
				"type": "uint256"
			}
		],
		"name": "setupVault",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getVaultDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "heir",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "lastCheckIn",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "inactivityLimit",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					}
				],
				"internalType": "struct InheritanceVault.Vault",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "vaults",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "heir",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "lastCheckIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "inactivityLimit",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ];

let provider, signer, contract;

async function init() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        loadData();
    } else {
        alert("Harap install MetaMask!");
    }
}

async function loadData() {
    const address = await signer.getAddress();
    const vault = await contract.getVaultDetails(address);
    document.getElementById("balanceText").innerText = ethers.utils.formatEther(vault.balance) + " ETH";
}

async function setupVault() {
    const heir = document.getElementById("heirAddress").value;
    const days = document.getElementById("inactivityDays").value;
    const tx = await contract.setupVault(heir, days);
    await tx.wait();
    alert("Vault berhasil disetup!");
}

async function checkIn() {
    const tx = await contract.checkIn();
    await tx.wait();
    alert("Check-in berhasil!");
}

// Simulasi integrasi Payment Gateway
async function simulateCardPayment() {
    alert("Mengarahkan ke Gateway Xendit/Stripe...");
    // Di dunia nyata, backend kamu akan menerima IDR, membeli ETH, 
    // lalu mengirimkan ETH tersebut ke fungsi deposit() kontrak ini.
    const amountInEth = "0.01"; // Simulasi hasil konversi Rp 1jt ke ETH
    const tx = await contract.deposit({ value: ethers.utils.parseEther(amountInEth) });
    await tx.wait();
    loadData();
    alert("Pembayaran Berhasil & ETH ditambahkan ke Vault!");
}

window.onload = init;