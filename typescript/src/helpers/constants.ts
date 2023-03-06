export const chainIds = new Set<number>([1, 56, 42161, 137, 43114, 10, 250]);

interface DatasetIds {
  [key: number]: string;
}

export const datasetIds: DatasetIds = {
  1: 'sq_786661e4d8b140cfb22f77cae19de1c5',
  56: 'sq_14d40ded55034637868a1b857917f10b',
  42161: 'sq_e0f899885862445995cb5286bdfd1b26',
  137: 'sq_f4ef7e179b594f9ca66578f017b227f1',
  43114: 'Avalanche will be supported in Q2, 2023. Please use custom scan count type.',
  10: 'Optimism will be supported in Q2, 2023. Please use custom scan count type.',
  250: 'Fantom will be suppored in Q3, 2023. Please use custom scan count type.',
};

export const queryPayload = {
  query:
    '{records{   contract_interaction_count   contract_creation_count   erc_approval_all_count   erc_approval_count   erc_transfer_count   large_value_transfer_count   transfer_count   tx_count   tx_with_input_data_count }}',
};
