#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod guardian_policy {
    use ink::prelude::vec::Vec;

    #[ink(storage)]
    pub struct GuardianPolicy {
        guardian: AccountId,
        child: AccountId,
        allowlist: Vec<AccountId>,
        spend_cap: Balance,
        paused: bool,
    }

    #[ink(event)]
    pub struct AllowlistUpdated {
        #[ink(topic)]
        allowlist: Vec<AccountId>,
    }

    #[ink(event)]
    pub struct CapUpdated {
        #[ink(topic)]
        new_cap: Balance,
    }

    #[ink(event)]
    pub struct Paused {
        #[ink(topic)]
        paused: bool,
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        NotGuardian,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    impl GuardianPolicy {
        #[ink(constructor)]
        pub fn new(guardian: AccountId, child: AccountId, spend_cap: Balance) -> Self {
            Self {
                guardian,
                child,
                allowlist: Vec::new(),
                spend_cap,
                paused: false,
            }
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            let caller = Self::env().caller();
            Self {
                guardian: caller,
                child: caller,
                allowlist: Vec::new(),
                spend_cap: 0,
                paused: false,
            }
        }

        #[ink(message)]
        pub fn set_allowlist(&mut self, allowlist: Vec<AccountId>) -> Result<()> {
            self.ensure_guardian()?;
            self.allowlist = allowlist.clone();
            self.env().emit_event(AllowlistUpdated { allowlist });
            Ok(())
        }

        #[ink(message)]
        pub fn set_cap(&mut self, cap: Balance) -> Result<()> {
            self.ensure_guardian()?;
            self.spend_cap = cap;
            self.env().emit_event(CapUpdated { new_cap: cap });
            Ok(())
        }

        #[ink(message)]
        pub fn pause(&mut self, paused: bool) -> Result<()> {
            self.ensure_guardian()?;
            self.paused = paused;
            self.env().emit_event(Paused { paused });
            Ok(())
        }

        #[ink(message)]
        pub fn is_allowed(&self, account: AccountId) -> bool {
            self.allowlist.contains(&account)
        }

        #[ink(message)]
        pub fn get_cap(&self) -> Balance {
            self.spend_cap
        }

        #[ink(message)]
        pub fn is_paused(&self) -> bool {
            self.paused
        }

        #[ink(message)]
        pub fn get_guardian(&self) -> AccountId {
            self.guardian
        }

        #[ink(message)]
        pub fn get_child(&self) -> AccountId {
            self.child
        }

        fn ensure_guardian(&self) -> Result<()> {
            if self.env().caller() != self.guardian {
                return Err(Error::NotGuardian);
            }
            Ok(())
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        fn default_accounts() -> ink::env::test::DefaultAccounts<ink::env::DefaultEnvironment> {
            ink::env::test::default_accounts::<ink::env::DefaultEnvironment>()
        }

        fn set_caller(caller: AccountId) {
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(caller);
        }

        #[ink::test]
        fn constructor_works() {
            let accounts = default_accounts();
            let contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            assert_eq!(contract.get_guardian(), accounts.alice);
            assert_eq!(contract.get_child(), accounts.bob);
            assert_eq!(contract.get_cap(), 1000);
            assert_eq!(contract.is_paused(), false);
        }

        #[ink::test]
        fn default_constructor_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let contract = GuardianPolicy::default();
            assert_eq!(contract.get_guardian(), accounts.alice);
            assert_eq!(contract.get_child(), accounts.alice);
            assert_eq!(contract.get_cap(), 0);
            assert_eq!(contract.is_paused(), false);
        }

        #[ink::test]
        fn set_allowlist_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            let allowlist = ink::prelude::vec![accounts.charlie, accounts.django];
            assert!(contract.set_allowlist(allowlist.clone()).is_ok());
            
            assert!(contract.is_allowed(accounts.charlie));
            assert!(contract.is_allowed(accounts.django));
            assert!(!contract.is_allowed(accounts.eve));
        }

        #[ink::test]
        fn set_allowlist_fails_for_non_guardian() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            set_caller(accounts.bob);
            let allowlist = ink::prelude::vec![accounts.charlie];
            assert_eq!(contract.set_allowlist(allowlist), Err(Error::NotGuardian));
        }

        #[ink::test]
        fn set_cap_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            assert!(contract.set_cap(5000).is_ok());
            assert_eq!(contract.get_cap(), 5000);
        }

        #[ink::test]
        fn set_cap_fails_for_non_guardian() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            set_caller(accounts.bob);
            assert_eq!(contract.set_cap(5000), Err(Error::NotGuardian));
        }

        #[ink::test]
        fn pause_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            assert!(!contract.is_paused());
            assert!(contract.pause(true).is_ok());
            assert!(contract.is_paused());
            assert!(contract.pause(false).is_ok());
            assert!(!contract.is_paused());
        }

        #[ink::test]
        fn pause_fails_for_non_guardian() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            set_caller(accounts.bob);
            assert_eq!(contract.pause(true), Err(Error::NotGuardian));
        }

        #[ink::test]
        fn is_allowed_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            assert!(!contract.is_allowed(accounts.charlie));
            
            let allowlist = ink::prelude::vec![accounts.charlie];
            contract.set_allowlist(allowlist).unwrap();
            
            assert!(contract.is_allowed(accounts.charlie));
            assert!(!contract.is_allowed(accounts.django));
        }

        #[ink::test]
        fn get_cap_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            assert_eq!(contract.get_cap(), 1000);
        }

        #[ink::test]
        fn allowlist_can_be_updated() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            let allowlist1 = ink::prelude::vec![accounts.charlie];
            contract.set_allowlist(allowlist1).unwrap();
            assert!(contract.is_allowed(accounts.charlie));
            assert!(!contract.is_allowed(accounts.django));
            
            let allowlist2 = ink::prelude::vec![accounts.django, accounts.eve];
            contract.set_allowlist(allowlist2).unwrap();
            assert!(!contract.is_allowed(accounts.charlie));
            assert!(contract.is_allowed(accounts.django));
            assert!(contract.is_allowed(accounts.eve));
        }

        #[ink::test]
        fn paused_state_changes_correctly() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            let mut contract = GuardianPolicy::new(accounts.alice, accounts.bob, 1000);
            
            assert!(!contract.is_paused());
            
            contract.pause(true).unwrap();
            assert!(contract.is_paused());
            
            contract.pause(true).unwrap();
            assert!(contract.is_paused());
            
            contract.pause(false).unwrap();
            assert!(!contract.is_paused());
        }
    }

    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        use super::*;
        use ink_e2e::ContractsBackend;

        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        #[ink_e2e::test]
        async fn e2e_constructor_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = GuardianPolicyRef::new(
                ink_e2e::alice().account_id(),
                ink_e2e::bob().account_id(),
                1000,
            );

            let contract = client
                .instantiate("guardian_policy", &ink_e2e::alice(), &constructor)
                .submit()
                .await
                .expect("instantiate failed");

            let call_builder = contract.call_builder::<GuardianPolicy>();

            let get_cap = call_builder.get_cap();
            let get_cap_result = client.call(&ink_e2e::alice(), &get_cap).dry_run().await?;
            assert_eq!(get_cap_result.return_value(), 1000);

            Ok(())
        }

        #[ink_e2e::test]
        async fn e2e_set_allowlist_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = GuardianPolicyRef::new(
                ink_e2e::alice().account_id(),
                ink_e2e::bob().account_id(),
                1000,
            );

            let contract = client
                .instantiate("guardian_policy", &ink_e2e::alice(), &constructor)
                .submit()
                .await
                .expect("instantiate failed");

            let mut call_builder = contract.call_builder::<GuardianPolicy>();

            let charlie_id = ink_e2e::charlie::<ink_e2e::PolkadotConfig>().account_id();
            let allowlist = vec![charlie_id];
            
            let set_allowlist = call_builder.set_allowlist(allowlist);
            let _set_result = client
                .call(&ink_e2e::alice(), &set_allowlist)
                .submit()
                .await
                .expect("set_allowlist failed");

            let is_allowed = call_builder.is_allowed(charlie_id);
            let is_allowed_result = client.call(&ink_e2e::alice(), &is_allowed).dry_run().await?;
            assert_eq!(is_allowed_result.return_value(), true);

            Ok(())
        }
    }
}
