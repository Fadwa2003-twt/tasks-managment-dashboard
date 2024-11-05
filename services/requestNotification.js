const Employee = require("../models/employeeModel");

exports.notifyRotationManager = async (request) => {
  try {
    // Use aggregation to properly match employees with rotation_manager permission
    const rotationManagers = await Employee.aggregate([
      {
        $lookup: {
          from: "roles", // collection name for roles
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },
      {
        $unwind: "$roleData",
      },
      {
        $match: {
          "roleData.permissions": "rotation_manager",
        },
      },
    ]);

    if (rotationManagers.length === 0) {
      console.log("No rotation managers found with the required permission.");
      throw new Error(
        "No rotation managers found with the required permission."
      );
    }

    // Log found managers for debugging
    console.log(`Found ${rotationManagers.length} rotation managers`);

    // Create the notification
    const notification = {
      type: "ROTATION_REQUEST",
      requestId: request._id,
      employeeId: request.employee,
      date: request.date,
      requestType: request.requestType,
    };

    // Send notifications to each rotation manager
    const notificationPromises = rotationManagers.map(async (manager) => {
      try {
        console.log(
          `Sending notification to manager: ${manager.name} (${manager._id})`
        );

        // Here you would integrate with your notification system
        // For example, saving to a notifications collection:
        /*
                await Notification.create({
                    recipient: manager._id,
                    ...notification,
                    createdAt: new Date()
                });
                */

        return {
          managerId: manager._id,
          mangerName: manager.name,
          status: "success",
        };
      } catch (error) {
        console.error(`Failed to notify manager ${manager._id}:`, error);
        return {
          managerId: manager._id,
          status: "failed",
          error: error.message,
        };
      }
    });

    const results = await Promise.all(notificationPromises);

    // Log results
    results.forEach((result) => {
      console.log(
        `Notification result for ${result.mangerName}: ${result.status}`
      );
    });

    return results;
  } catch (error) {
    console.error("Error in notifyRotationManager:", error);
    throw error;
  }
};
