#!/bin/bash

# Seed Demo Data Script for Polkadot Child Safety Protocol
# This script creates sample data for testing the demo

set -e  # Exit on any error

echo "🌱 Seeding Demo Data for Polkadot Child Safety Protocol..."
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if backend is running
check_backend() {
    if ! curl -s http://localhost:3001/health >/dev/null 2>&1; then
        log_error "Backend is not running. Please start the services first."
        echo "Run: ./scripts/start-all.sh"
        exit 1
    fi
}

# Create demo accounts and policies
create_demo_data() {
    log_info "Creating demo accounts and policies..."
    
    # Create Node.js script for seeding
    cat > /tmp/seed-demo-data.js << 'EOF'
const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
const fs = require('fs');
const path = require('path');

async function seedDemoData() {
    try {
        await cryptoWaitReady();
        
        const keyring = new Keyring({ type: 'sr25519' });
        
        // Create demo accounts
        const parent = keyring.addFromUri('//Alice');
        const child = keyring.addFromUri('//Bob');
        const guardian = keyring.addFromUri('//Charlie');
        const approvedApp = keyring.addFromUri('//Dave');
        
        console.log('👥 Creating Demo Accounts:');
        console.log('   Parent (Alice):', parent.address);
        console.log('   Child (Bob):', child.address);
        console.log('   Guardian (Charlie):', guardian.address);
        console.log('   Approved App (Dave):', approvedApp.address);
        
        // Demo policy configurations
        const demoPolicies = [
            {
                name: "Toddler Policy",
                guardian: parent.address,
                child: child.address,
                spendCap: "1000000000000", // 1 unit
                allowlist: [
                    approvedApp.address,
                    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" // Charlie
                ],
                paused: false,
                ageGroup: "3-7",
                description: "Strict policy for young children with minimal spending"
            },
            {
                name: "Teen Policy", 
                guardian: parent.address,
                child: child.address,
                spendCap: "50000000000000", // 50 units
                allowlist: [
                    approvedApp.address,
                    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Charlie
                    "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"  // Dave
                ],
                paused: false,
                ageGroup: "13-17",
                description: "Moderate policy for teenagers with higher spending limits"
            }
        ];
        
        // Sample activity logs
        const demoActivities = [
            {
                timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                child: child.address,
                action: "login",
                application: approvedApp.address,
                status: "allowed",
                amount: "0"
            },
            {
                timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
                child: child.address,
                action: "purchase",
                application: approvedApp.address,
                status: "allowed",
                amount: "500000000000" // 0.5 units
            },
            {
                timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                child: child.address,
                action: "login_attempt",
                application: "5DAAnrj7VHTznn2AWxM9Gf6pB6m9gX5M3jL9TpY8zKqQ8Z9X",
                status: "blocked",
                amount: "0"
            }
        ];
        
        // Sample notifications
        const demoNotifications = [
            {
                id: "notif_1",
                recipient: parent.address,
                type: "activity_alert",
                title: "New Activity Detected",
                message: "Your child attempted to access a blocked application",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                read: false,
                priority: "medium"
            },
            {
                id: "notif_2", 
                recipient: parent.address,
                type: "spending_alert",
                title: "Spending Limit Alert",
                message: "Your child has used 50% of their weekly spending limit",
                timestamp: new Date(Date.now() - 43200000).toISOString(),
                read: true,
                priority: "low"
            },
            {
                id: "notif_3",
                recipient: parent.address,
                type: "policy_change",
                title: "Policy Updated",
                message: "Guardian policy has been successfully updated",
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                read: true,
                priority: "low"
            }
        ];
        
        // Create data directory if it doesn't exist
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Save demo data to files
        const demoData = {
            accounts: {
                parent: parent.address,
                child: child.address,
                guardian: guardian.address,
                approvedApp: approvedApp.address
            },
            policies: demoPolicies,
            activities: demoActivities,
            notifications: demoNotifications,
            createdAt: new Date().toISOString()
        };
        
        fs.writeFileSync(
            path.join(dataDir, 'demo-accounts.json'),
            JSON.stringify(demoData.accounts, null, 2)
        );
        
        fs.writeFileSync(
            path.join(dataDir, 'demo-policies.json'),
            JSON.stringify(demoPolicies, null, 2)
        );
        
        fs.writeFileSync(
            path.join(dataDir, 'demo-activities.json'),
            JSON.stringify(demoActivities, null, 2)
        );
        
        fs.writeFileSync(
            path.join(dataDir, 'demo-notifications.json'),
            JSON.stringify(demoNotifications, null, 2)
        );
        
        fs.writeFileSync(
            path.join(dataDir, 'demo-complete.json'),
            JSON.stringify(demoData, null, 2)
        );
        
        console.log('\\n💾 Demo data saved to data/ directory:');
        console.log('   - demo-accounts.json');
        console.log('   - demo-policies.json');
        console.log('   - demo-activities.json');
        console.log('   - demo-notifications.json');
        console.log('   - demo-complete.json');
        
        console.log('\\n🎯 Demo Summary:');
        console.log(`   Created ${demoPolicies.length} policy templates`);
        console.log(`   Generated ${demoActivities.length} activity logs`);
        console.log(`   Created ${demoNotifications.length} notifications`);
        console.log('\\n✅ Demo data seeding completed successfully!');
        
    } catch (error) {
        console.error('❌ Error seeding demo data:', error);
        process.exit(1);
    }
}

seedDemoData();
EOF
    
    # Run the seeding script
    cd backend && node /tmp/seed-demo-data.js && cd ..
    
    if [ $? -eq 0 ]; then
        log_success "Demo data created successfully!"
    else
        log_error "Failed to create demo data"
        exit 1
    fi
    
    # Clean up temporary file
    rm -f /tmp/seed-demo-data.js
}

# Create contract deployment script
create_contract_deployment() {
    log_info "Preparing contract deployment data..."
    
    cat > /tmp/deploy-contract.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Create deployment configuration
const deploymentConfig = {
    network: "development",
    nodeUrl: "ws://localhost:9944",
    contractPath: "../guardian_policy/target/ink/guardian_policy.contract",
    deployer: "//Alice",
    constructorArgs: {
        guardian: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Alice
        child: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",    // Bob
        spendCap: "10000000000000" // 10 units
    },
    timestamp: new Date().toISOString()
};

// Save deployment config
const dataDir = path.join(process.cwd(), '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
    path.join(dataDir, 'deployment-config.json'),
    JSON.stringify(deploymentConfig, null, 2)
);

console.log('📋 Contract deployment configuration created');
console.log('   Location: data/deployment-config.json');
EOF
    
    cd backend && node /tmp/deploy-contract.js && cd ..
    rm -f /tmp/deploy-contract.js
    
    log_success "Contract deployment data prepared!"
}

# Display demo data summary
display_summary() {
    echo ""
    echo "🎉 Demo Data Seeding Complete!"
    echo "=============================="
    echo ""
    echo "📊 Created Data:"
    echo "   👥 Demo Accounts: 4 (Parent, Child, Guardian, Approved App)"
    echo "   📋 Policy Templates: 2 (Toddler, Teen)"
    echo "   📝 Activity Logs: 3 sample activities"
    echo "   🔔 Notifications: 3 sample notifications"
    echo "   📄 Deployment Config: Contract deployment settings"
    echo ""
    echo "📂 Files Created in data/ directory:"
    ls -la data/
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Open frontend: http://localhost:3000"
    echo "   2. Login with demo account (Alice //Alice)"
    echo "   3. Create a policy for your child"
    echo "   4. Test the end-to-end flow"
    echo ""
    echo "📖 Demo Flow:"
    echo "   1. Parent creates child account"
    echo "   2. Parent sets up guardian policy"
    echo "   3. Child uses approved applications"
    echo "   4. Parent monitors activity and receives notifications"
    echo ""
}

# Main execution
main() {
    # Check if backend is running
    check_backend
    
    # Create data directory
    mkdir -p data
    
    # Seed the data
    create_demo_data
    create_contract_deployment
    display_summary
}

# Handle script interruption
trap 'echo ""; log_warning "Script interrupted"; exit 1' INT

# Run main function
main "$@"