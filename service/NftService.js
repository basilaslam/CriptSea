const nftModel = require('../model/NFT');

module.exports = class NftService {
  static async createNft(data) {
    const NFT = {};
    NFT.nft_name = data.name;
    NFT.category = data.category;
    NFT.collection = data.collection;
    NFT.price = {
      old_price: 0,
      new_price: data.price[1],
      offers: null,
    };
    NFT.created_date = new Date().toLocaleString();
    NFT.price_type = data.price_fix_currency;
    NFT.payment_type = data.payment_type;
    NFT.wallet_address = data.wallet_address;
    NFT.approval_status = 'Pending';
    NFT.soft_delete = false;
    try {
      const savedNFT = await nftModel(NFT).save();
      console.log(savedNFT);
      return savedNFT;
    } catch (err) {
      console.log(err.message);
    }
  }

  static async getAllNfts() {
    try {
      const response = await nftModel.find({ approval_status: 'approved', soft_delete: false });
      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  static async getNft(id) {
    try {
      const nft = await nftModel.findOne({ id });
      return nft;
    } catch (err) {
      console.log(err);
    }
  }

  static async softDelete(productId) {
    try {
      const filter = { _id: productId };
      const update = { soft_delete: true };
      const updatedProduct = await nftModel.findOneAndUpdate(filter, update);
      return updatedProduct;
    } catch (err) {
      console.log(err);
    }
  }
};