// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {IFollowModule} from "@aave/lens-protocol/contracts/interfaces/IFollowModule.sol";
import {ModuleBase} from '@aave/lens-protocol/contracts/core/modules/ModuleBase.sol';
import {FollowValidatorFollowModuleBase} from '@aave/lens-protocol/contracts/core/modules/follow/FollowValidatorFollowModuleBase.sol';

contract SecretCodeFollowModule is IFollowModule,FollowValidatorFollowModuleBase {
    error PasscodeInvalid();

    mapping(uint256 => uint256) internal _passcodeByProfile;

    constructor(address hub) ModuleBase(hub) {}

    function initializeFollowModule(uint256 profileId, bytes calldata data)
        external
        override
        onlyHub
        returns (bytes memory)
    {
        uint256 passcode = abi.decode(data, (uint256));
        _passcodeByProfile[profileId] = passcode;
        return data;
    }

    function processFollow(
        address follower,
        uint256 profileId,
        bytes calldata data
    ) external view override {
        uint256 passcode = abi.decode(data, (uint256));
        if (passcode != _passcodeByProfile[profileId]) revert PasscodeInvalid();
    }

    function followModuleTransferHook(
        uint256 profileId,
        address from,
        address to,
        uint256 followNFTTokenId
    ) external override {}
}
//0x90706D17Ea1e673FAdCC48858A4197eA16D5017f
